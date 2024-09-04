"use server";

import { createClient } from "@/utils/supabase/server";
import { FormState } from "@/utils/db/types";
import { transactionSchema } from "@/utils/db/schema";

const supabase = createClient();

export async function onCreateAction(formData: FormData): Promise<FormState> {
  const data = {
    account_id: Number(formData.get("account_id")),
    amenity_id: Number(formData.get("amenity_id")),
    amount_paid: Number(formData.get("amount_paid")),
    platform: formData.get("platform"),
    transaction_date: formData.get("transaction_date"),
    notes: formData.get("notes"),
    receipt_info: formData.get("receipt_info"),
    status: formData.get("status"),
  };

  console.log("Submitted formData:", data);

  // Parse the form data using Zod schema
  const parsed = transactionSchema.safeParse(data);

  console.log("Parsed data:", parsed);

  if (!parsed.success) {
    return {
      status: 400,
      message: `Invalid data. Error: ${parsed.error.message}`,
    };
  }

  const { error, status } = await supabase
    .from("transactions")
    .insert([parsed.data])
    .select();

  if (error) return { status: status, message: `Database error: ${error}` };

  return { status: 201, message: "Transaction Added Successfully!" };
}

export async function onUpdateAction(formData: FormData): Promise<FormState> {
  try {
    const transaction_id = Number(formData.get("transaction_id"));

    // Ensure that transaction_id is a valid number before proceeding
    if (isNaN(transaction_id)) {
      throw new Error("Invalid transaction_id");
    }

    const form = {
      account_id: Number(formData.get("account_id")),
      amenity_id: Number(formData.get("amenity_id")),
      amount_paid: Number(formData.get("amount_paid")),
      platform: formData.get("platform"),
      transaction_date: formData.get("transaction_date"),
      notes: formData.get("notes"),
      receipt_info: formData.get("receipt_info"),
      status: formData.get("status"),
    };

    // Parse the form data using Zod schema
    const parsed = transactionSchema.safeParse(form);
    if (!parsed.success) {
      return {
        status: 400,
        message: `Invalid data. Error: ${parsed.error.message}`,
      };
    }

    console.log("Parsed result:", parsed);

    const { data, error, status } = await supabase
      .from("transactions")
      .update(form)
      .eq("transaction_id", transaction_id)
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
      message: "Amenity Updated Successfully!",
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

export async function onDeleteAction(id: number): Promise<FormState> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      status: 401,
      message: "User not logged in",
      success: false,
    };
  }

  try {
    const { error, status } = await supabase
      .from("transactions")
      .delete()
      .eq("transaction_id", id);

    if (error) {
      console.error("Error deleting transaction:", error.message);
      return {
        status: status,
        message: `Error deleting transaction: ${error.message}`,
        success: false,
      };
    }

    return {
      status: 200,
      message: "Transaction deleted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      status: 500,
      message: "Unexpected error occurred",
      success: false,
    };
  }
}
