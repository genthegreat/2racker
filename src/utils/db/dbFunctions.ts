import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { AccountDetails } from "./types";

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

export async function fetchAmenityDataById(id: number): Promise<Amenities> {
  const { data: amenity, error } = await supabase
    .from("amenities")
    .select("*")
    .eq("amenity_id", `${id}`)
    .single();

  if (error) {
    console.log(error);
  }

  // console.log("fetchAmenityDataById", amenity);
  return amenity as Amenities;
}

export async function getAllAccounts(): Promise<Accounts[]> {
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
  return accounts as Accounts[];
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

export async function getTransactionHistory(): Promise<Transaction[]> {
  const { data: transaction, error } = await supabase
    .from("transactions")
    .select(
      `
      transaction_id,
      transaction_date,
      amount_paid,
      notes,
      platform,
      status,
      amenity_id,
      receipt_info,
      amenities (
        amenity_id,
        amenity_name,
        category,
        default_amount
      ),
      account_id,
      accounts (
        account_id,
        account_name,
        amount_due,
        amount_paid,
        balance,
        start_date,
        status
      )
    `
    )

  if (error) {
    console.error(error);
  }

  console.log("Transaction History on getTransactionHistory", transaction);
  return transaction as Transaction[];
}

export async function getAccountDetails(): Promise<AccountDetails[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: accountDetails, error } = await supabase.rpc(
    "get_account_details",
    { p_user_id: user?.id }
  );

  if (error) {
    console.error(error);
  }

  console.log("Transaction History on accountDetails", accountDetails);
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

export async function getAmenities(id: string | null): Promise<Amenities[]> {
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
  return amenities as Amenities[];
}

export async function getProjects(
  id: number | string | null
): Promise<Projects[]> {
  const { data: projects, error } = id
    ? await supabase.from("projects").select("*").eq("account_id", `${id}`)
    : await supabase.from("projects").select("*");

  if (error) {
    console.error("Error in getProjects", error);
  }

  // console.log("projects", projects);
  return projects as Projects[];
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

export async function getAmenityAccountId(
  amenityId: number
): Promise<number | null> {
  const { data, error } = await supabase
    .from("amenities")
    .select(
      `
      project_id,
      projects (
        account_id
      )
    `
    )
    .eq("amenity_id", amenityId)
    .single();

  console.log("getAmenityAccountId:", data);

  if (error) {
    console.error("Error fetching account ID:", error);
    return null;
  }

  // Handle projects being an array
  const accountId = (data?.projects as unknown as { account_id: number })?.account_id || null;

  console.log("accountId:", accountId);

  return accountId;
}
