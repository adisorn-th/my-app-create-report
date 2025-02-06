"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import * as mammoth from "mammoth";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";

const variables = [
    { id: "name", label: "Name", value: "Est" },
    { id: "date", label: "Date", value: "{date}" },
    { id: "address", label: "Address", value: "{address}" },
];

const TemplateEditor: React.FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const [content, setContent] = useState("");

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }], // header levels
                        ['bold', 'italic', 'underline', 'strike'], // bold, italic, underline, strikethrough
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }], // ordered and bullet lists
                        [{ 'indent': '-1' }, { 'indent': '+1' }], // indentation
                        [{ 'align': [] }], // alignment
                        [{ 'color': [] }, { 'background': [] }], // text color and background color
                        ['link', 'image', 'video'], // links, images, videos
                        [{ 'font': ['TH Sarabun', 'sans-serif'] }],
                        [{ 'size': ['small', 'medium', 'large', 'huge'] }], // font size
                        [{ 'script': 'sub' }, { 'script': 'super' }], // subscript and superscript
                        ['blockquote'], // blockquote
                        ['code-block'], // code block
                        ['clean'], // clean content (remove formatting)
                    ],
                },
            });

            quillRef.current.on("text-change", () => {
                setContent(quillRef.current!.root.innerHTML);
            });
        }
    }, []);

    // 📌 นำเข้าไฟล์ .txt, .html, .docx
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        if (file.type === "text/plain" || file.type === "text/html") {
            reader.onload = (e) => {
                const text = e.target?.result as string;
                if (quillRef.current) {
                    quillRef.current.root.innerHTML = text;
                }
            };
            reader.readAsText(file);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            reader.onload = async (e) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;

                try {
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    if (quillRef.current) {
                        quillRef.current.root.innerHTML = result.value;
                    }
                } catch (error) {
                    console.error("Error converting DOCX:", error);
                    alert("ไม่สามารถเปิดไฟล์ .docx ได้");
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert("รองรับเฉพาะไฟล์ .txt, .html, และ .docx");
        }
    };

    // 📌 ส่งออกเป็น .docx
    const exportToWord = async () => {
        const htmlContent = quillRef.current?.root.innerHTML || "";

        const parseHtmlToDocx = (html: string) => {
            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: html.split("<br>").map((line) => {
                            const paraText = line.replace(/<[^>]+>/g, ""); // ลบ HTML tag
                            const textRun = new TextRun(paraText);
                            return new Paragraph({
                                children: [textRun],
                            });
                        }),
                    },
                ],
            });
            return doc;
        };

        const doc = parseHtmlToDocx(htmlContent);

        try {
            const blob = await Packer.toBlob(doc);
            saveAs(blob, "Template.docx");
        } catch (error) {
            console.error("Error exporting DOCX:", error);
            alert("เกิดข้อผิดพลาดในการส่งออกไฟล์ .docx");
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // ใช้ HTML เนื้อหาจาก Quill
        const htmlContent = quillRef.current?.root.innerHTML || "";

        // แปลง HTML เป็นข้อความเพื่อนำมาแสดงใน PDF
        const text = htmlContent.replace(/<\/?[^>]+(>|$)/g, ""); // ลบ HTML tag

        // เพิ่มข้อความลงใน PDF
        doc.text(text, 10, 10);

        // ดาวน์โหลดไฟล์ PDF
        doc.save("Template.pdf");
    };


    // 📌 ฟังก์ชันลากและวางตัวแปร
    const handleDragStart = (e: React.DragEvent, variable: string) => {
        e.dataTransfer.setData("text", variable);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const variable = e.dataTransfer.getData("text");
        const quill = quillRef.current;
        if (quill) {
            const range = quill.getSelection();
            const position = range ? range.index : 0;
            quill.insertText(position, variable);
        }
    };

    return (
        <div className="flex h-screen p-4">
            {/* Sidebar - Variables */}
            <div className="w-64 bg-gray-100 p-4">
                <h2 className="font-bold mb-4">Variables</h2>
                {variables.map((variable) => (
                    <div
                        key={variable.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, variable.value)}
                        className="bg-white p-2 mb-2 rounded cursor-move hover:bg-gray-50"
                    >
                        {variable.label}
                    </div>
                ))}
                <input type="file" accept=".txt,.html,.docx" onChange={handleFileUpload} className="mt-4" />
                <button onClick={exportToWord} className="bg-blue-500 text-white p-2 rounded mt-4 w-full">
                    Export to Word
                </button>
                <button onClick={exportToPDF} className="bg-green-500 text-white p-2 rounded mt-4 w-full">
                    Export to PDF
                </button>
            </div>

            {/* Main Editor */}
            <div
                className="flex-1 flex flex-col p-4"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <div ref={editorRef} className="h-full bg-white p-2 border rounded" />
            </div>

            {/* Preview Panel */}
            <div className="w-1/3 bg-gray-50 p-4 overflow-auto">
                <h2 className="font-bold mb-4">Preview</h2>
                <div className="bg-white p-4 rounded" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
};

export default TemplateEditor;
