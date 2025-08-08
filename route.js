// app/api/verify-admin-password/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();

    // IMPORTANT: In a real application, you would hash the password
    // (e.g., using bcrypt) and compare the hash. For this example,
    // we're doing a direct string comparison with an environment variable.
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD environment variable is not set.");
      return NextResponse.json({ success: false, message: "Server configuration error." }, { status: 500 });
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Incorrect password." }, { status: 401 });
    }
  } catch (error) {
    console.error("Error verifying admin password:", error);
    return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
  }
}