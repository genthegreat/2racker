"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { serializeError } from "@/utils/utils";
import { FormState } from "@/utils/db/types";
import { projectSchema } from "@/utils/db/schema";

const supabase = createClient();

export async function onSubmitAction(data: FormData): Promise<FormState> {
  console.log("Raw formData:", data);
  const formData = Object.fromEntries(data.entries());

  const processedData = {
    ...formData,
    account_id: formData.account_id ? Number(formData.account_id) : null, // Convert to number
  };

  console.log("Processed formData:", processedData);

  const parsed = projectSchema.safeParse(processedData);
  console.log("Parsed result:", parsed);

  if (!parsed.success) {
    return {
      status: 404,
      message: `Invalid data. Error: ${parsed.error.message}`,
    };
  }

  const { error } = await supabase
    .from("projects")
    .insert([parsed.data])
    .select();

  if (error) return { status: 200, message: `Database error: ${error}` };
  //   redirect("/error?error=" + encodeURIComponent(serializeError(error)));

  // revalidatePath("/", "layout");
  // redirect("/accounts");
  return { status: 200, message: "Project Added!" };
}

export async function update(formData: FormData) {
  try {
    const project_id = formData.get("id");

    const form = {
      project_name: formData.get("name") as string,
      description: formData.get("description") as string,
      account_id: formData.get("accountId"),
    };

    console.log(form);

    const { data, error, status } = await supabase
      .from("projects")
      .update(form)
      .eq("project_id", project_id)
      .select();

    console.log("status code", status);

    if (error) throw error;

    if (data) console.log("Project Updated!", data);
    return { success: true, data, status };
  } catch (error: any) {
    console.log("An error occured!", error);
    return { success: false, error: error.message };
  }
}

export async function del(project_id: number) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("User not logged in or unexpected error:", error);
    redirect("/login");
  }

  try {
    const { data, error } = await supabase.rpc("delete_project", {
      project_id,
    });

    if (error) {
      console.error("Error deleting project:", error.message);
      redirect("/error?error=" + encodeURIComponent(serializeError(error)));
    } else {
      console.log("Project deleted successfully:", data);
      revalidatePath("/", "layout");
      redirect("/projects");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    redirect("/error?error=" + encodeURIComponent(serializeError(error)));
  }
}
