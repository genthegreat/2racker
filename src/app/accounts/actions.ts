"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { serializeError } from "@/utils/utils";
import { FormState } from "@/utils/db/types";
import { accountSchema } from "@/utils/db/schema";

const supabase = createClient();

export async function onCreateAction(data: FormData): Promise<FormState> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 401,
      message: "User not authenticated.",
    };
  }

  const { id } = user;

  console.log("Raw formData:", data);
  const formData = Object.fromEntries(data.entries());

  const processedData = {
    ...formData,
    user_id: id,
  };

  console.log("Processed formData:", processedData);

  const parsed = accountSchema.safeParse(processedData);
  console.log("Parsed result:", parsed);

  if (!parsed.success) {
    return {
      status: 400,
      message: `Invalid data. Error: ${parsed.error.message}`,
    };
  }

  const { error } = await supabase.from("accounts").insert([parsed.data]);

  console.log(error);

  if (error)
    return { status: 406, message: `Database error: ${error.message}` };

  return { status: 201, message: "Account Added Successfully!" };
}

export async function onUpdateAction(formData: FormData): Promise<FormState> {
  try {
    const account_id = formData.get("id");

    const form = {
      account_name: formData.get("name") as string,
      start_date: formData.get("date") as string,
      status: (formData.get("status") as string).toLowerCase(),
    };

    console.log(form);
    // Parse the form data using Zod schema
    const parsed = accountSchema.safeParse(form);
    if (!parsed.success) {
      return {
        status: 400,
        message: `Invalid data. Error: ${parsed.error.message}`,
        success: false,
      };
    }

    const { data, error, status } = await supabase
      .from("accounts")
      .update(parsed.data)
      .eq("account_id", account_id)
      .select();

    if (error) {
      return {
        status: status,
        message: `Database error: ${error.message}`,
        success: false,
      };
    }

    return {
      status: status,
      message: "Project Updated Successfully!",
      success: true,
    };
  } catch (error: any) {
    console.log("An error occured!", error);
    return {
      status: 500,
      message: `Unexpected error: ${error.message}`,
      success: false,
    };
  }
}

export async function del(accountId: number) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("User not logged in or unexpected error:", error);
    redirect("/login");
  }

  try {
    const { data, error: deleteAccountError } = await supabase.rpc(
      "delete_account",
      { account_id: accountId }
    );

    if (deleteAccountError) {
      console.error("Error deleting account:", deleteAccountError.message);
      redirect(
        "/error?error=" + encodeURIComponent(serializeError(deleteAccountError))
      );
    } else {
      console.log("Account deleted successfully:", data);
      revalidatePath("/", "layout");
      redirect("/accounts");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    redirect("/error?error=" + encodeURIComponent(serializeError(error)));
  }
}
