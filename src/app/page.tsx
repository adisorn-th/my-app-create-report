"use client";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
//import MyEditor from "@/components/QuillEditor";

const TemplateEditor = dynamic(() => import("../components/TemplateEditor"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const onload = async () => {
    const storedKey = localStorage.getItem('user');
    if (storedKey) {
    } else {
      localStorage.removeItem('user');
      router.push('/login')
    }
  }
  useEffect(() => {
    onload();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-8">
        <div className="mb-4">
          <TemplateEditor />
        </div>
      </div>
    </>
  );
}
