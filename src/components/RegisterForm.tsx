"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (data.success) {
            router.push("/login");
        } else {
            alert("Registration failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-center">สมัครสมาชิก</h2>
                <input
                    type="text"
                    placeholder="ชื่อ"
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                    สมัครสมาชิก
                </button>
                <p className="text-center text-sm mt-3">
                    มีบัญชีแล้ว? <a href="/login" className="text-blue-500">เข้าสู่ระบบ</a>
                </p>
            </form>
        </div>
    );
}
