import { createClientComponentClient, User } from "@supabase/auth-helpers-nextjs";
import { Account, AccountDetails, Amenity, Project, Transaction } from "./types";

export const supabase = createClientComponentClient();

/* 
Note to self: 
- Standardize function names. use 'get' for mulitple and 'fetch' for singular returns
*/

export async function getCurrentUser(): Promise<User> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // console.log(user);
  return user as User;
}

export async function getAccountData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("accounts")
    .select("amount_due, amount_paid, balance")
    .eq("user_id", `${user?.id}`);

  if (error) {
    console.error(error);
    throw error;
  }

  const summedValues = data.reduce((acc: any, obj: any) => {
    // Loop through each key in the current object
    Object.keys(obj).forEach((key) => {
      // Add the value of the current key to the accumulator
      acc[key] = (acc[key] || 0) + obj[key];
    });
    // console.log(acc);
    return acc;
  }, {});

  // console.log(summedValues);
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

  // console.log(account);
  return account;
}

export async function fetchAmenityDataById(id: number): Promise<Amenity> {
  const { data: amenity, error } = await supabase
    .from("amenities")
    .select("*")
    .eq("amenity_id", `${id}`)
    .single();

  if (error) {
    console.log(error);
  }

  // console.log("fetchAmenityDataById", amenity);
  return amenity as Amenity;
}

export async function getAllAccounts(): Promise<Account[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accounts, error } = user
    ? await supabase.from("accounts").select("*").eq("user_id", `${user.id}`)
    : await supabase.from("accounts").select("*");

  if (error) {
    console.error(error);
  }

  // console.log(accounts);
  return accounts as Account[];
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
    console.error(error);
  }

  // console.log("Project", data);
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
    console.error(error);
  }

  // console.log("Transaction History", accounts);
  return accounts as Account[];
}

export async function getAccountDetails(): Promise<AccountDetails[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accountDetails, error } = await supabase
    .rpc('get_account_details', { p_user_id: user?.id });

  if (error) {
    console.error(error);
  }

  // console.log("Transaction History", accountDetails);
  return accountDetails as AccountDetails[];
}

export async function getProfileData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  // console.log(data);
  return data;
}

export async function getAmenities(id: string | null): Promise<Amenity[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: amenities, error } = id
    ? await supabase.from("amenities").select("*").eq("project_id", `${id}`)
    : await supabase.from("amenities").select("*");

  if (error) {
    console.error(error);
  }

  // console.log(amenities);
  return amenities as Amenity[];
}

export async function getProjects(
  id: number | string | null
): Promise<Project[]> {
  const { data: projects, error } = id
    ? await supabase.from("projects").select("*").eq("account_id", `${id}`)
    : await supabase.from("projects").select("*");

  if (error) {
    console.error("Error in getProjects", error);
  }

  // console.log("projects", projects);
  return projects as Project[];
}

export async function getTransactions(
  id: number | null
): Promise<Transaction[]> {
  const { data: transaction, error } = id
    ? await supabase
        .from("transactions")
        .select("*")
        .eq("transaction_id", `${id}`)
        .single()
    : await supabase.from("transactions").select("*");

  if (error) {
    console.error(error);
  }

  // console.log("Transaction", transaction);
  return transaction;
}

export async function fetchTransactionDataById(id: number) {
  const { data: transaction, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("transaction_id", `${id}`)
    .single();

  if (error) {
    console.log(error);
    return error;
  }

  // console.log(transaction);
  return transaction;
}
