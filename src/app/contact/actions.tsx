"use server"

import { FormState } from "@/utils/db/types";
import { contactSchema } from "@/utils/db/schema";

export async function onCreateAction(data: FormData): Promise<FormState> {

    const formData = Object.fromEntries(data.entries());

    // parse to ensure data is valid
    const parsed = contactSchema.safeParse(formData);

    if (!parsed.success) {
        return {
            status: 400,
            message: `Invalid data. Error: ${parsed.error.message}`,
        };
    }

    // Example server side rule
    if (parsed.data.name.includes("test")) {
        return { status: 401, message: "Invalid Input. Name uses keyword." };
    }

    console.log(parsed)

    // const { error } = await supabase
    //     .from("projects")
    //     .insert([parsed.data])
    //     .select();

    // if (error) return { status: 406, message: `Database error: ${error}` };

    return { status: 201, message: "Project Added Successfully!" };
}