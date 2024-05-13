import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Account, Amenity, Project, Transaction } from "./types";

const supabase = createClientComponentClient();

export async function getAccountData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("accounts")
    .select("amount_due, amount_paid, balance")
    .eq("user_id", `${user?.id}`);

  if (error) {
    console.log(error);
    throw error;
  }

  const summedValues = data.reduce((acc: any, obj: any) => {
    // Loop through each key in the current object
    Object.keys(obj).forEach((key) => {
      // Add the value of the current key to the accumulator
      acc[key] = (acc[key] || 0) + obj[key];
    });
    console.log(acc);
    return acc;
  }, {});

  console.log(summedValues);
  return summedValues;
}

export async function fetchAccountDataById(id: number) {
  const { data: account, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("account_id", `${id}`)
    .single();

  if (error) {
    console.log(error);
    return error;
  }

  console.log(account);
  return account;
}

export async function fetchAmenityDataById(id: number) {
  const { data: account, error } = await supabase
    .from("amenities")
    .select("*")
    .eq("amenity_id", `${id}`)
    .single();

  if (error) {
    console.log(error);
    return error;
  }

  console.log(account);
  return account;
}

export async function getAllAccounts(): Promise<Account[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accounts, error } = user
    ? await supabase.from("accounts").select("*").eq("user_id", `${user.id}`)
    : await supabase.from("accounts").select("*")

  if (error) {
    console.log(error);
    throw error;
  }

  console.log(accounts);
  return accounts;
}

export async function getProjectData(id: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("project_id", `${id}`)
    .single();

  if (error) {
    console.log(error);
    throw error;
  }

  console.log(data);
  return data;
}

export async function getTransactionHistory(): Promise<Account[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accounts, error } = await supabase
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

  console.log("Transaction History", accounts);
  return accounts as Account[];
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

export async function getAmenities(): Promise<Amenity[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: amenities, error } = await supabase
    .from("amenities")
    .select("*");

  if (error) {
    console.log(error);
    throw error;
  }

  console.log(amenities);
  return amenities;
}

export async function getProjects(id: string | null): Promise<Project[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects, error } = id
    ? await supabase.from("projects").select("*").eq("account_id", `${id}`)
    : await supabase.from("projects").select("*");

  if (error) {
    console.log(error);
    throw error;
  }

  console.log("projects", projects);
  return projects;
}

export async function getTransactions(id: number | null): Promise<Transaction[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: transactions, error } = id
    ? await supabase.from("transactions").select("*").eq("transaction_id", `${id}`).single()
    : await supabase.from("transactions").select("*");

  if (error) {
    console.log(error);
    throw error;
  }

  console.log("Transaction", transactions);
  return transactions;
}