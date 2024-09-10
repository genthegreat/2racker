import { z } from "zod";

export const accountSchema = z.object({
  account_id: z.number().optional(),
  account_name: z.string().min(1, {
    message: "Account name is required",
  }),
  amount_due: z.number().optional(),
  amount_paid: z.number().optional(),
  balance: z.number().optional(),
  start_date: z.string().date("Date of format YYYY-MM-DD is required"),
  status: z.string(),
  user_id: z.string().optional(),
});

export const amenitySchema = z.object({
  amenity_id: z.number().optional(),
  amenity_name: z.string(),
  category: z.string().nullable().optional(),
  default_amount: z.number().nullable().optional(),
  project_id: z.number({
    message: "Project is Required",
  }),
});

export const profileSchema = z.object({
  avatar_url: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  id: z.string(),
  updated_at: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
});

export const projectSchema = z.object({
  account_id: z.number({
    message: "Account is Required",
  }),
  amount_due: z.number().nullable().optional(),
  amount_paid: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  project_name: z.string().min(1, {
    message: "Project name is required",
  }),
  project_id: z.number().optional(),
});

export const transactionSchema = z.object({
  account_id: z.number(),
  amenity_id: z.number(),
  amount_paid: z.number(),
  notes: z.string().nullable().optional(),
  platform: z.string().min(1, {
    message: "Payment Platform is required",
  }),
  receipt_info: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  transaction_date: z.string().date("Date of format YYYY-MM-DD is required"),
  transaction_id: z.number().optional(),
});

export const deleteAccountArgsSchema = z.object({
  account_id: z.number(),
});

export const deleteAmenityArgsSchema = z.object({
  amenity_id: z.number(),
});

export const deleteProjectArgsSchema = z.object({
  project_id: z.number(),
});

export const getAccountDetailsArgsSchema = z.object({
  p_user_id: z.string(),
});

export const transactionStatusEnum = z.enum(["success", "failure", "pending"]);

export const contactSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email("email is required"),
  message: z.string().min(20, {
    message: "Description is required. Minimum 20 characters.",
  }),
});

// Export schemas for all tables
export const schemas = {
  accounts: accountSchema,
  amenities: amenitySchema,
  profiles: profileSchema,
  projects: projectSchema,
  transactions: transactionSchema,
  delete_account: deleteAccountArgsSchema,
  delete_amenity: deleteAmenityArgsSchema,
  delete_project: deleteProjectArgsSchema,
  get_account_details: getAccountDetailsArgsSchema,
  transaction_status: transactionStatusEnum,
};
