import { formatCurrency } from '../../../utils/utils';
import { fetchAmenityDataById, getAmenities } from "@/utils/db/dbFunctions";
import DeleteButton from '../deleteButton';

export async function generateStaticParams() {
  const amenities = await getAmenities(null)

  // console.log(amenities)

  return amenities.map((amenity) => ({
    amenity_id: amenity.amenity_id.toString()
  }))
}

export default async function AmenityDetail({ params }: { params: { amenity_id: number } }) {
  const { amenity_id } = params

  const res = await fetchAmenityDataById(amenity_id)

  if (!res.amenity_id) {
    console.error("Error fetching amenity data!");
    return <h1>Amenity not found!</h1>
  }

  console.log("amenity data", res)

  return (
    <div>
      <h1>{res.amenity_name}</h1>
      <h6>Amount due: {formatCurrency(res.default_amount)}</h6>
      <h6>Category: {res.category}</h6>

      <div className='pt-10'>
        <DeleteButton amenity={amenity_id} />
      </div>
    </div>
  );
};
