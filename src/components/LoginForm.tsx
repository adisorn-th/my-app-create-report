"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("password");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (data.success) {
            router.push("/");
        } else {
            alert("Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-center">เข้าสู่ระบบ</h2>
                <input
                    type="email"
                    placeholder="อีเมล"
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="รหัสผ่าน"
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    เข้าสู่ระบบ
                </button>
                <p className="text-center text-sm mt-3">
                    ยังไม่มีบัญชี? <a href="/register" className="text-blue-500">สมัครสมาชิก</a>
                </p>
            </form>
        </div>
    );
}
