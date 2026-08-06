import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { message: "Authentication required to reset password." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const newPassword =
      typeof body?.newPassword === "string" ? body.newPassword.trim() : "";

    if (!newPassword) {
      return NextResponse.json(
        { message: "A new password is required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return NextResponse.json(
        { message: error.message || "There was an error updating your password." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Password updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset-password POST handler:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
