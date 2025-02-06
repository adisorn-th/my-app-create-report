"use client";
import dynamic from "next/dynamic";

const TemplateEditor = dynamic(() => import("../components/TemplateEditor"), { ssr: false });

export default function Home() {

  return (
    <div className="p-8">
      <div className="mb-4">
        <TemplateEditor />
       
      </div>
    </div>
  );
}
