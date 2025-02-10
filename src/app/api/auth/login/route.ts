import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (email === "test@example.com" && password === "password") {
        return NextResponse.json({ success: true, token: "fake-token" });
    } else {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }
}
