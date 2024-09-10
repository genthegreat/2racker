import sendgrid from "@sendgrid/mail";
import { NextRequest, NextResponse } from "next/server";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;

if (!SENDGRID_API_KEY) {
  throw new Error(
    "SENDGRID_API_KEY is not defined in the environment variables"
  );
}

sendgrid.setApiKey(SENDGRID_API_KEY);

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("Route has been called.");
  try {
    const msg = {
      to: "2racker@princekwesi.website",
      from: "2racker@princekwesi.website",
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };

    console.log("REQ.BODY", req.body);
    await sendgrid.send(msg);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: `Internal Server Error: ${error.response.body}` },
      { status: error.statusCode || 500 }
    );
  }

  return NextResponse.json(
    { message: "Message sent successfully!" },
    { status: 200 }
  );
}
