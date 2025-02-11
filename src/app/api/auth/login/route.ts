import { NextRequest } from "next/server";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from "bcryptjs";
//import jwt from 'jsonwebtoken';
var jwt = require("jsonwebtoken");
// export async function POST(req: NextRequest) {
//     const { email, password } = await req.json();

//     if (email === "test@example.com" && password === "password") {
//         return NextResponse.json({ success: true, token: "fake-token" });
//     } else {
//         return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
//     }
// }
export async function POST(req: NextRequest) {
    try {
        const db = await open({
            filename: 'mydb.sqlite',
            driver: sqlite3.Database
        });
        const body = await req.json(); // Parse request body
        if (body.username) {
            const row = await db.get('SELECT * FROM user WHERE email = ?', [body.username]);
            if (!row) {
                return Response.json(({ success: false, error: "User not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            var passwordIsValid = bcrypt.compareSync(
                body.password,
                row.password
            );
            if (!passwordIsValid) {
                return Response.json(({ success: false, error: "Invalid Password!" }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            var token = jwt.sign({ id: row.id }, 'bakpob', {
                expiresIn: 86400 * 90 // 24 hours
            });

            delete row.password
            row.token = token;
            return Response.json(({ success: true, users: row }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    catch {
        return Response.json(({ success: false, error: "User not found" }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
