import { NextRequest, NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma"; // Ensure Prisma is properly initialized
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); // Parse request body

        if (!body.username || !body.password) {
            return NextResponse.json(
                { success: false, error: "Username and password are required" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.users.findUnique({
            where: { email: body.username }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Validate password
        const passwordIsValid = bcrypt.compareSync(body.password, user.password);
        if (!passwordIsValid) {
            return NextResponse.json(
                { success: false, error: "Invalid password!" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, SECRET_KEY, {
            expiresIn: 86400 * 90 // 90 days
        });

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(
            { success: true, user: { ...userWithoutPassword, token } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
