// pages/amenities/[amenity_id].tsx

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { formatCurrency } from '../../../utils/utils';

interface Amenity {
  amenity_id: number;
  amenity_name: string;
  default_amount: number;
  category: string;
  project_id: number;
}

interface AmenityDetailProps {
  amenity: Amenity;
}

const supabase = createClientComponentClient();

export async function generateStaticParams() {
  const { data: amenities } = await supabase.from('amenities').select('*')

  console.log(amenities)
  
  return amenities?.map((amenity) => ({
    amenity_id: amenity.amenity_id,
    default_amount: amenity.default_amount
  }))
}

export default function AmenityDetail({ params }: any) {
  const { amenity_id, default_amount } = params

  console.log("params:", params)

  return (
    <div>
      <h1>ID: {amenity_id}</h1>
      <p>Amount Due: {default_amount}</p>
      {/* Add other details you want to display */}
    </div>
  );
};
