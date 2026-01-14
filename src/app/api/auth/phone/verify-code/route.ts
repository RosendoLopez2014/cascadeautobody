import { NextResponse } from "next/server";
import { verifyCode, formatPhoneNumber } from "@/lib/twilio";
import { woocommerce } from "@/lib/woocommerce";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone number and verification code are required" },
        { status: 400 }
      );
    }

    // Verify the code
    const verification = await verifyCode(phone, code);

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || "Invalid verification code" },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phone);
    const phoneDigits = formattedPhone.replace(/\D/g, "");

    // Check if a customer with this phone already exists
    let customer = null;
    try {
      const customers = await woocommerce.searchCustomers({
        search: formattedPhone,
        per_page: 10,
      });

      if (customers && customers.length > 0) {
        customer = customers.find(
          (c) =>
            c.billing?.phone === formattedPhone ||
            c.billing?.phone?.replace(/\D/g, "") === phoneDigits
        );
      }
    } catch {
      // Customer search failed, will create new
    }

    // If no customer exists, create one
    if (!customer) {
      try {
        const placeholderEmail = `${phoneDigits}@phone.cascade.local`;
        customer = await woocommerce.createCustomer({
          email: placeholderEmail,
          first_name: "",
          last_name: "",
          username: `phone_${phoneDigits}`,
          billing: {
            phone: formattedPhone,
            first_name: "",
            last_name: "",
            address_1: "",
            address_2: "",
            city: "",
            state: "",
            postcode: "",
            country: "US",
            email: placeholderEmail,
            company: "",
          },
        });
      } catch {
        return NextResponse.json(
          { error: "Failed to create account. Please try again." },
          { status: 500 }
        );
      }
    }

    // Return user data for frontend to store
    return NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name || "",
        lastName: customer.last_name || "",
        phone: formattedPhone,
        isPhoneUser: true,
      },
    });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 }
    );
  }
}
