"use server";

import { createClient } from "@/utils/supabase/server";
import { FormState } from "@/utils/db/types";
import { projectSchema } from "@/utils/db/schema";

const supabase = createClient();

export async function onCreateAction(data: FormData): Promise<FormState> {
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
      status: 400,
      message: `Invalid data. Error: ${parsed.error.message}`,
    };
  }

  if (parsed.data.project_name.includes("test")) {
    return { status: 401, message: "Invalid Input. Name uses keyword." };
  }

  const { error } = await supabase
    .from("projects")
    .insert([parsed.data])
    .select();

  if (error) return { status: 406, message: `Database error: ${error}` };

  return { status: 201, message: "Project Added Successfully!" };
}

export async function onUpdateAction(formData: FormData): Promise<FormState> {
  try {
    const project_id = formData.get("project_id");

    const form = {
      project_name: formData.get("project_name") as string,
      description: formData.get("description") as string,
      account_id: formData.get("accountId") ? Number(formData.get("accountId")) : null,
    };

    // Parse the form data using Zod schema
    const parsed = projectSchema.safeParse(form);
    if (!parsed.success) {
      return {
        status: 400,
        message: `Invalid data. Error: ${parsed.error.message}`,
        success: false,
      };
    }

    // Perform additional custom validation if needed
    if (parsed.data.project_name.includes("test")) {
      return { status: 401, message: "Invalid Input. Name uses keyword.", success: false };
    }

    // Proceed with updating the project in the database
    const { error, status } = await supabase
      .from("projects")
      .update(parsed.data)
      .eq("project_id", project_id)
      .select();

    if (error) {
      return { status: status, message: `Database error: ${error.message}`, success: false };
    }

    return { status: status, message: "Project Updated Successfully!", success: true };
  } catch (error: any) {
    console.log("An error occurred!", error);
    return { status: 500, message: `Unexpected error: ${error.message}`, success: false };
  }
}

export async function onDeleteAction(project_id: number) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("User not logged in or unexpected error:", error);
    return { success: false, error: "User not logged in" };
  }

  try {
    const { data, error } = await supabase.rpc("delete_project", {
      project_id,
    });

    if (error) {
      console.error("Error deleting project:", error.message);
      return { success: false, error: error.message };
    } else {
      console.log("Project deleted successfully:", data);
      return { success: true };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
}
