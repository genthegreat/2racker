import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { serializeError } from "@/utils/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next");

  const redirectTo = request.nextUrl.clone();
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      if (type === "recovery") {
        redirectTo.pathname = "/reset-password";
        redirectTo.searchParams.set("recovery", "1");
      } else if (nextParam && nextParam.startsWith("/")) {
        redirectTo.pathname = nextParam;
      } else {
        redirectTo.pathname = "/profile";
      }

      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/error";
  redirectTo.searchParams.set(
    "error",
    serializeError({
      message: "Email link is invalid or has expired.",
      name: "AuthConfirmError",
    })
  );
  return NextResponse.redirect(redirectTo);
}
