import twilio from "twilio";

// Get Twilio client (lazy loaded)
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }

  return twilio(accountSid, authToken);
}

// Format phone number to E.164 format
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // If it starts with 1 and is 11 digits, it's already US format
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  // If it's 10 digits, assume US and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // Otherwise return as-is with + prefix
  return `+${digits}`;
}

// Send verification code via Twilio Verify
export async function sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    // Dev mode - no Twilio configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !serviceSid) {
      return { success: true };
    }

    const client = getTwilioClient();

    await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: formattedPhone,
        channel: "sms",
      });

    return { success: true };
  } catch (error) {
    console.error("Error sending verification code:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send verification code",
    };
  }
}

// Verify the code using Twilio Verify
export async function verifyCode(phoneNumber: string, code: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    // Dev mode - accept any 6-digit code
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !serviceSid) {
      return { valid: true };
    }

    const client = getTwilioClient();

    const verification = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: formattedPhone,
        code,
      });

    if (verification.status === "approved") {
      return { valid: true };
    }
    return { valid: false, error: "Invalid verification code." };
  } catch (error) {
    // Handle specific Twilio errors
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return { valid: false, error: "Verification code expired. Please request a new code." };
      }
      if (error.message.includes("max check attempts")) {
        return { valid: false, error: "Too many attempts. Please request a new code." };
      }
    }

    return {
      valid: false,
      error: "Verification failed. Please try again.",
    };
  }
}
