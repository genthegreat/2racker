import { contactSchema } from "@/utils/db/schema";
import { rateLimitMiddleware } from "@/utils/rateLimiter";
import sendgrid from "@sendgrid/mail";
import { NextRequest, NextResponse } from "next/server";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;

if (!SENDGRID_API_KEY) {
  throw new Error(
    "SENDGRID_API_KEY is not defined in the environment variables"
  );
}

sendgrid.setApiKey(SENDGRID_API_KEY);

export async function POST(req: NextRequest) {
  const rateLimitError = await rateLimitMiddleware(req)
  if (rateLimitError) return rateLimitError;
  
  try {
    const { name, email, message } = await req.json();

    // Zod validation
    const parsed = contactSchema.safeParse({ name, email, message });

    if (!parsed.success) {
      return NextResponse.json(
        { error: `Invalid data. ${parsed.error.message}` },
        { status: 400 }
      );
    }

    // Profanity check
    if (parsed.data.message.includes("fuck")) {
      return NextResponse.json(
        { error: "Profanity is not allowed." },
        { status: 400 }
      );
    }

    // Send email via SendGrid
    const msg = {
      to: "2racker@princekwesi.website",
      from: "2racker@princekwesi.website",
      subject: `Feedback from Contact Page`,
      text: parsed.data.message,
      html: `<div class="container" style="margin-left: 20px;margin-right: 20px;">
          <h3>Client Feedback</h3>
          <div style="font-size: 16px;">
          <p><strong>Name: </strong> ${parsed.data.name}</p>
          <p><strong>Email: </strong> ${parsed.data.email}</p>  
          <p><strong>Message:</strong></p>
            <p>${parsed.data.message}</p>
            <br>
          </div>
        </div>`,
    };
    await sendgrid.send(msg);

  } catch (error: any) {
    console.log(error);

    // Handle sendgrid-specific error or general error
    const errorMessage =
      error.response?.body?.errors || error.message || "Internal Server Error";

    return NextResponse.json(
      { error: errorMessage },
      { status: error.statusCode || 500 }
    );
  }

  return NextResponse.json(
    { message: "Message sent successfully!" },
    { status: 200 }
  );
}
