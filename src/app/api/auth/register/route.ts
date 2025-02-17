import { NextRequest, NextResponse } from "next/server";
//import { prisma } from "@/lib/prisma"; // Ensure Prisma is properly initialized
import bcrypt from "bcryptjs";
//import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    const newPost = await prisma.users.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 8)
      },
    })
    return Response.json({ success: true, data: newPost })
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}
