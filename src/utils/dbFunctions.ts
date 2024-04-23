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
  .from('projects')
  .select(`
    project_id,
    project_name,
    description,
    amount_due,
    amount_paid,
    balance,
    account_id
  `)
  .eq('account_id', `${id}`)
  .single();

  if (error) {
    console.log(error);
    throw error;
  }

  console.log(data);
  return data;
}
