import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  const supabase = createClient();

  const { newPassword, event } = req.body;

  console.log("event:", event);

  if (req.method === "POST") {
    if (newPassword) {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (data) {
        console.log(data);
        res.status(200).json({ message: "Password updated successfully!" });
      } else {
        console.log(error);
        res.status(400).json({
          message: "There was an error updating your password.",
          error,
        });
      }
    } else {
      res.status(400).json({ message: "Invalid event type." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
