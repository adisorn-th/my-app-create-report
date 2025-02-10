import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { type NextRequest } from 'next/server';
//import { NextRequest, Response } from 'next/server';

// 📌 CREATE (เพิ่มโพสต์ใหม่)
export async function POST(req: NextRequest) {
    try {
        const db = await open({
            filename: 'mydb.sqlite',
            driver: sqlite3.Database
        });

        const body = await req.json();
        const { name, content, user_id } = body;

        if (!name || !content || !user_id) {
            return Response.json({ success: false, error: "All fields are required" },
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
        }

        const createdAt = Date.now();

        const result = await db.run(
            'INSERT INTO posts (name, content, user_id, createdat) VALUES (?, ?, ?, ?)',
            [name, content, user_id, createdAt]
        );

        await db.close();

        return  Response.json(({ success: true, postId: result.lastID }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return Response.json(({ success: false, error: (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}


// 📌 READ (ดึงข้อมูลโพสต์ทั้งหมด หรือโพสต์ตาม ID)
export async function GET(req: NextRequest) {
    try {
        const db = await open({
            filename: 'mydb.sqlite',
            driver: sqlite3.Database
        });

        if (req) {
            const url = new URL(req.url);
            const id = url.searchParams.get("id");

            if (id) {
                const post = await db.get('SELECT * FROM posts WHERE id = ?', [id]);
                await db.close();

                if (!post) {
                    return Response.json(({ success: false, error: "Post not found" }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                return Response.json(({ success: true, post }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        const posts = await db.all('SELECT * FROM posts');
        await db.close();

        return Response.json(({ success: true, posts }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        return Response.json(({ success: false, error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// 📌 UPDATE (อัปเดตโพสต์)
export async function PUT(req: NextRequest) {
    try {
        const db = await open({
            filename: 'mydb.sqlite',
            driver: sqlite3.Database
        });

        const body = await req.json();
        const { id, name, content } = body;

        if (!id || !name || !content) {
            return Response.json(({ success: false, error: "ID, name, and content are required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await db.run(
            'UPDATE posts SET name = ?, content = ? WHERE id = ?',
            [name, content, id]
        );

        await db.close();

        if (result.changes === 0) {
            return Response.json(({ success: false, error: "Post not found or not updated" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return Response.json(({ success: true, message: "Post updated successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return Response.json(({ success: false, error: (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// 📌 DELETE (ลบโพสต์)
export async function DELETE(req: NextRequest) {
    try {
        const db = await open({
            filename: 'mydb.sqlite',
            driver: sqlite3.Database
        });

        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return Response.json(({ success: false, error: "ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await db.run('DELETE FROM posts WHERE id = ?', [id]);
        await db.close();

        if (result.changes === 0) {
            return Response.json(({ success: false, error: "Post not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return Response.json(({ success: true, message: "Post deleted successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return Response.json(({ success: false, error: (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
