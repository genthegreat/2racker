"use server";

import { createClient } from "@/utils/supabase/server";
import { FormState } from "@/utils/db/types";
import { amenitySchema } from "@/utils/db/schema";

const supabase = createClient();

export async function onCreateAction(formData: FormData): Promise<FormState> {
  const data = {
    amenity_name: formData.get("amenity_name") as string,
    default_amount: Number(formData.get("default_amount")),
    category: formData.get("category") as string,
    project_id: Number(formData.get("project_id")),
  };

  // Parse the form data using Zod schema
  const parsed = amenitySchema.safeParse(data);
  if (!parsed.success) {
    return {
      status: 400,
      message: `Invalid data. Error: ${parsed.error.message}`,
    };
  }

  const { error } = await supabase
    .from("amenities")
    .insert([parsed.data])
    .select();

  if (error) return { status: 406, message: `Database error: ${error}` };

  return { status: 201, message: "Project Added Successfully!" };
}

export async function onUpdateAction(formData: FormData): Promise<FormState> {
  try {
    const amenity_id = Number(formData.get("amenity_id"));

    // Ensure that amenity_id is a valid number before proceeding
    if (isNaN(amenity_id)) {
      throw new Error("Invalid amenity_id");
    }

    const form = {
      amenity_name: formData.get("amenity_name") as string,
      default_amount: Number(formData.get("default_amount")),
      category: formData.get("category") as string,
      project_id: Number(formData.get("project_id")),
    };

    // Parse the form data using Zod schema
    const parsed = amenitySchema.safeParse(form);
    if (!parsed.success) {
      return {
        status: 400,
        message: `Invalid data. Error: ${parsed.error.message}`,
      };
    }

    const { data, error, status } = await supabase
      .from("amenities")
      .update(parsed.data)
      .eq("amenity_id", amenity_id)
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

export async function onDeleteAction(amenity_id: number): Promise<FormState> {
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
    const { error } = await supabase
      .from("amenities")
      .delete()
      .eq("amenity_id", amenity_id);

    if (error) {
      console.error("Error deleting amenity:", error.message);
      return {
        status: 406,
        message: `Error deleting amenity: ${error.message}`,
        success: false,
      };
    }

    return {
      status: 200,
      message: "Amenity deleted successfully!",
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
