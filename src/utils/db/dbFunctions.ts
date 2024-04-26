import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export async function getAccountData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("accounts")
    .select("amount_due, amount_paid, balance")
    .eq("user_id", `${user?.id}`)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }

  console.log(data);
  return data;
}

export async function getProjectData(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
    project_id,
    project_name,
    description,
    amount_due,
    amount_paid,
    balance,
    account_id
  `
    )
    .eq("account_id", `${id}`)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }

  console.log(data);
  return data;
}

export async function getFullAccountData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("accounts")
    .select(
      `
        account_id,
        account_name,
        status,
        start_date,
        amount_due,
        amount_paid,
        balance,
        projects (
          project_name,
          amenities(
            amenity_id,
            amenity_name,
            default_amount,
            transactions(
              transaction_id,
              amount_paid,
              transaction_date,
              platform,
              receipt_info,
              status
            )
          )
        )
      `
    )
    .eq("user_id", `${user?.id}`);

  if (error) {
    console.log(error);
    throw error;
  }

  console.log(data);
  return data;
}

export async function getProfileData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", user?.id)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }

  console.log(data);
  return data;
}
