"use server";

import { createClient } from "@/utils/supabase/server";
import { FormState } from "@/utils/db/types";
import { accountSchema, deleteAccountArgsSchema } from "@/utils/db/schema";

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
    const account_id = Number(formData.get("account_id"));

    // Ensure that account_id is a valid number before proceeding
    if (isNaN(account_id)) {
      throw new Error("Invalid account_id");
    }

    const form = {
      account_name: formData.get("account_name") as string,
      start_date: formData.get("start_date") as string,
      status: formData.get("status") as string,
    };

    // Parse the form data using Zod schema
    const parsed = accountSchema.safeParse(form);
    if (!parsed.success) {
      return {
        status: 400,
        message: `Invalid data. Error: ${parsed.error.message}`,
        success: false,
      };
    }

    console.log("Parsed result:", parsed);

    const { data, error, status } = await supabase
      .from("accounts")
      .update(parsed.data)
      .eq("account_id", account_id)
      .select();

    console.log("supabase result", data, error, status);

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

export async function onDeleteAction(account_id: number): Promise<FormState> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("User not logged in or unexpected error:", error);
    return {
      status: 401,
      message: "User not logged in",
      success: false,
    };
  }

  try {
    const { error } = await supabase
      .from("accounts")
      .delete()
      .eq("account_id", account_id);

    if (error) {
      console.error("Error deleting account:", error.message);
      return {
        status: 406,
        message: `Error deleting project: ${error.message}`,
        success: false,
      };
    }

    return {
      status: 200,
      message: "Account deleted successfully!",
      success: true,
    };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return {
      status: 500,
      message: "Unexpected error occurred",
      success: false,
    };
  }
}
