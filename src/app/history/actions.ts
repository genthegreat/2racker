"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serializeError } from "../../utils/utils";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export async function submit(formData: FormData) {
  const data = {
    notes: formData.get("notes") as string,
    amount_paid: formData.get("amount"),
    transaction_date: formData.get("date") as string,
    platform: formData.get("platform"),
    receipt_info: formData.get("receipt"),
    status: formData.get("status"),
    amenity_id: formData.get("amenity"),
  };

  console.log(data);

  const { error } = await supabase.from("transactions").insert([data]).select();

  if (error) {
    redirect("/error?error=" + encodeURIComponent(serializeError(error)));
  }

  revalidatePath("/", "layout");
  redirect("/history");
}

export async function update(formData: FormData) {
  try {
    const id = formData.get("id");

    const form = {
      notes: formData.get("notes") as string,
      amount_paid: formData.get("amount"),
      transaction_date: formData.get("date") as string,
      platform: formData.get("platform"),
      receipt_info: formData.get("receipt"),
      status: formData.get("status"),
      amenity_id: formData.get("amenity"),
    };

    const { data, error, status } = await supabase
      .from("transactions")
      .update(form)
      .eq("transaction_id", id)
      .select();

    console.log("status code", status);

    if (error) throw error;

    if (data) console.log("Transaction Updated!", data);
    return { success: true, data, status };
  } catch (error: any) {
    console.log("An error occured!", error);
    return { success: false, error: error.message };
  }
}

export async function del(id: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error, status } = await supabase
      .from("transactions")
      .delete()
      .eq("transaction_id", id);

    console.log("Status from delete:", status)
    if (error) redirect('/error?error=' + encodeURIComponent(serializeError(error)))

    revalidatePath("/", "layout");
    redirect("/history");
  }
}