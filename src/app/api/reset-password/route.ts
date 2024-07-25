import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";

// Handle POST requests
export async function POST(request: NextRequest) {
  const supabase = createClient();
  
  try {
    const { newPassword, event } = await request.json();

    console.log("event:", event);

    if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (data) {
        console.log(data);
        return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });
      } else {
        console.log(error);
        return NextResponse.json({ message: "There was an error updating your password.", error }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "Invalid event type." }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}

// Handle GET requests
export async function GET(request: NextRequest) {
  const greeting = "Hello World!!";
  const json = {
    greeting,
  };

  return NextResponse.json(json, { status: 200 });
}
