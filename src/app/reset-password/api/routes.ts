import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";

export default async function handler(req: { method: string; body: { newPassword: any; event: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; error?: AuthError | null; }): void; new(): any; }; }; }) {
  const supabase = createClient();

  if (req.method === "POST") {
    const { newPassword, event } = req.body;

    if (event === "PASSWORD_RECOVERY") {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (data) {
        res.status(200).json({ message: "Password updated successfully!" });
      } else {
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
