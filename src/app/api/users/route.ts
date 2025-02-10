import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// GET: Fetch all users or a specific user by ID
export async function GET(req?: Request) {
    try {
        const db = await open({
            filename: 'mydb.sqlite',
            driver: sqlite3.Database
        });

        if (req) {
            const url = new URL(req.url);
            const id = url.searchParams.get("id"); // Get ID from query params

            if (id) {
                // Fetch user by ID
                const row = await db.get('SELECT * FROM user WHERE id = ?', [id]);
                await db.close();

                if (!row) {
                    return new Response(JSON.stringify({ success: false, error: "User not found" }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                return new Response(JSON.stringify({ success: true, user: row }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // Fetch all users
        const rows = await db.all('SELECT * FROM user');
        await db.close();

        return new Response(JSON.stringify({ success: true, users: rows }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// POST: Create a new user
export async function POST(req: Request) {
    try {
        const db = await open({
            filename: 'mydb.sqlite',
            driver: sqlite3.Database
        });

        const body = await req.json(); // Parse request body

        const result = await db.run(
            'INSERT INTO user (first_name, last_name, email) VALUES (:first_name, :last_name, :email)',
            {
                ':first_name': body.first_name,
                ':last_name': body.last_name,
                ':email': body.email
            }
        );

        await db.close(); // Ensure DB is closed after use

        return new Response(JSON.stringify({ success: true, result }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// PUT: Update an existing user by ID
export async function PUT(req: Request) {
    try {
        const db = await open({
            filename: 'mydb.sqlite',
            driver: sqlite3.Database
        });

        const body = await req.json(); // Parse request body
        const { id, first_name, last_name, email } = body;

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await db.run(
            'UPDATE user SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
            [first_name, last_name, email, id]
        );

        await db.close();

        if (result.changes === 0) {
            return new Response(JSON.stringify({ success: false, error: "User not found or not updated" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true, message: "User updated successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// DELETE: Remove a user by ID
export async function DELETE(req: Request) {
    try {
        const db = await open({
            filename: 'mydb.sqlite',
            driver: sqlite3.Database
        });

        const url = new URL(req.url);
        const id = url.searchParams.get("id"); // Get ID from query params

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await db.run('DELETE FROM user WHERE id = ?', [id]);
        await db.close();

        if (result.changes === 0) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true, message: "User deleted successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
