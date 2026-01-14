import { NextResponse } from "next/server";
import { sendVerificationCode, formatPhoneNumber } from "@/lib/twilio";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Basic phone validation
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    const result = await sendVerificationCode(phone);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send verification code" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
      phone: formatPhoneNumber(phone),
    });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json(
      { error: "An error occurred while sending the verification code" },
      { status: 500 }
    );
  }
}
