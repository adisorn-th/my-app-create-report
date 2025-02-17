"use client";
import { useEffect, useRef, useState } from "react";
import * as mammoth from "mammoth";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from "docx";
import dynamic from "next/dynamic";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { htmlToText } from "html-to-text";
import { HealthRecordsbyHNEN } from "@/app/api/health-records";
import Swal from 'sweetalert2';
import { CreatePost } from "@/app/api/main";
import { useRouter } from "next/navigation";

const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), { ssr: false });


// // ตัวแปรที่สามารถลากไปใส่ใน Editor
// https://api-h-series.telecorp.co.th/api/HealthRecords/byHN
// const variables = [
//     { id: "name", label: "Name", value: "{name}" },
//     { id: "date", label: "Date", value: "{date}" },
//     { id: "address", label: "Address", value: "{address}" },
// ];

interface Posts {
    title?: string;
    content?: string;
    userId: Number;
}
interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    token: string;
}

const TemplateEditor: React.FC = () => {
    const editorRef = useRef<any>(null);
    const [posts, setPosts] = useState<Posts>({
        title: '',
        content: '',
        userId: 0
    });
    const [content, setContent] = useState(null);//useState<string>("");
    const [hn] = useState("52-23-017636"); // กำหนดค่าเริ่มต้น
    const [en] = useState("O24149002");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(""); // ค่าที่ใช้ค้นหา
    const [list, setlist] = useState({})
    const [editorHtml, setEditorHtml] = useState({})
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    // ฟังก์ชันดึงข้อมูลจาก API
    // const fetchData = async () => {
    //     setLoading(true);

    //     try {
    //         const response = await HealthRecordsbyHNEN({ hn, en });
    //         const result = await response;

    //         const variables = result?.data
    //             ? Object.keys(result.data).map((key) => ({
    //                 id: key,
    //                 label: key.replace(/_/g, " ").toUpperCase(),
    //                 value: result.data[key] ?? "",
    //             }))
    //             : [];

    //         console.log("Fetched Data:", variables);
    //         setData(variables);
    //     } catch (error) {
    //         console.error("Error fetching health record:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const onload = async () => {
        // // let res = await getDetailByid(router.query.id)
        //
        const storedUser = localStorage.getItem('user');
        if (storedUser) {

            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.users) {
                setUser(parsedUser.users);
            }
        }
        // if (storedKey) {
        //     // router.push('/patientinfo')
        // } else {
        //     localStorage.removeItem('user');
        //     router.push('/login')
        // }

        let res: any = []
        console.log("res", res)
        setlist(res.data)
        setEditorHtml(res?.data?.dt_Project?.detail)
    }

    // ใช้ useEffect อย่างถูกต้อง
    useEffect(() => {
        //fetchData();
        onload();
    }, []); // เรียก API เมื่อโหลดหน้า

    // ฟิลเตอร์ข้อมูลจากการค้นหา
    const filteredData = data.filter((variable) =>
        variable.label.toLowerCase().includes(search.toLowerCase())
    );

    // เมื่อมีการเปลี่ยนแปลงใน Editor
    const handleEditorChange = (content1: string) => {
        setPosts(prevPosts => ({ ...prevPosts, content: content1 }));
    };

    // ลากตัวแปรไปใส่ใน Editor
    const handleDragStart = (e: React.DragEvent, variable: string) => {
        e.dataTransfer.setData("text/plain", variable);
    };

    // ปล่อยตัวแปรลงใน TinyMCE Editor
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const variable = e.dataTransfer.getData("text/plain");
        if (editorRef.current) {
            editorRef.current.insertContent(variable);
        }
    };

    // // Export to Word
    // const exportToWord2 = () => {
    //     // ✅ แปลง HTML → JSON
    //     const parsedContent = JSONToHTML(content);

    //     // ✅ ฟังก์ชันแปลง JSON → Word Document
    //     const convertToDocxElements = (elements: any[]): any[] => {
    //         return elements.map((element) => {
    //             if (typeof element === "string") {
    //                 return new Paragraph({
    //                     children: [new TextRun({ text: element, font: "TH Sarabun New", size: 32 })],
    //                 });
    //             }

    //             // 📌 ตรวจสอบว่ามี `content` และเป็น Array หรือไม่
    //             const contentArray = Array.isArray(element.content) ? element.content : [];

    //             switch (element.tag) {
    //                 case "h1":
    //                     return new Paragraph({
    //                         heading: HeadingLevel.HEADING_1,
    //                         children: [new TextRun({ text: contentArray?.[0] || "", font: "TH Sarabun New", size: 48, bold: true })],
    //                     });

    //                 case "h2":
    //                     return new Paragraph({
    //                         heading: HeadingLevel.HEADING_2,
    //                         children: [new TextRun({ text: contentArray?.[0] || "", font: "TH Sarabun New", size: 40, bold: true })],
    //                     });

    //                 case "p":
    //                     return new Paragraph({
    //                         children: [new TextRun({ text: contentArray?.[0] || "", font: "TH Sarabun New", size: 32 })],
    //                     });

    //                 case "strong":
    //                     return new Paragraph({
    //                         children: [new TextRun({ text: contentArray?.[0] || "", font: "TH Sarabun New", size: 32, bold: true })],
    //                     });

    //                 case "em":
    //                     return new Paragraph({
    //                         children: [new TextRun({ text: contentArray?.[0] || "", font: "TH Sarabun New", size: 32, italics: true })],
    //                     });

    //                 case "u":
    //                     return new Paragraph({
    //                         children: [new TextRun({ text: contentArray?.[0] || "", font: "TH Sarabun New", size: 32, underline: {} })],
    //                     });

    //                 case "ul":
    //                     return contentArray.map((li: any) =>
    //                         new Paragraph({
    //                             bullet: { level: 0 },
    //                             children: [new TextRun({ text: li.content?.[0] || "", font: "TH Sarabun New", size: 32 })],
    //                         })
    //                     );

    //                 case "ol":
    //                     return contentArray.map((li: any, index: number) =>
    //                         new Paragraph({
    //                             numbering: { reference: "numberList", level: 0 },
    //                             children: [new TextRun({ text: li.content?.[0] || "", font: "TH Sarabun New", size: 32 })],
    //                         })
    //                     );

    //                 case "table":
    //                     return new Table({
    //                         rows: contentArray.map((row: any) =>
    //                             new TableRow({
    //                                 children: row.content?.map((cell: any) =>
    //                                     new TableCell({
    //                                         width: { size: 50, type: WidthType.PERCENTAGE },
    //                                         children: [new Paragraph({ children: [new TextRun({ text: cell.content?.[0] || "", font: "TH Sarabun New", size: 32 })] })],
    //                                     })
    //                                 ) || [],
    //                             })
    //                         ),
    //                     });

    //                 default:
    //                     return new Paragraph({
    //                         children: [new TextRun({ text: contentArray?.[0] || "", font: "TH Sarabun New", size: 32 })],
    //                     });
    //             }
    //         });
    //     };


    //     // ✅ แปลงเนื้อหาเป็นโครงสร้าง Word
    //     const doc = new Document({
    //         numbering: {
    //             config: [{ reference: "numberList", levels: [{ level: 0, format: "decimal", text: "%1.", alignment: "left" }] }],
    //         },
    //         sections: [{ properties: {}, children: convertToDocxElements(parsedContent.content) }],
    //     });

    //     // ✅ Export เป็นไฟล์ .docx
    //     Packer.toBlob(doc).then((blob) => {
    //         saveAs(blob, "Template.docx");
    //     });
    // };
    const exportToWord = () => {
        // const textContent = htmlToText(content, {
        //     wordwrap: 130,
        //     preserveNewlines: true,
        // });
        // const doc = new Document({
        //     sections: [
        //         {
        //             properties: {},
        //             children: textContent.split("\n").map((line: any) =>
        //                 new Paragraph({
        //                     children: [
        //                         new TextRun({
        //                             text: line,
        //                             font: "TH Sarabun New", // 📌 กำหนดฟอนต์ภาษาไทย
        //                             size: 32, // ขนาดฟอนต์ (16 = 8pt, 32 = 16pt)
        //                             bold: false, // ตัวหนา
        //                             italics: false, // ตัวเอียง
        //                         }),
        //                     ],
        //                 })
        //             ),
        //         },
        //     ],
        // });

        // Packer.toBlob(doc).then((blob) => {
        //     saveAs(blob, "Template.docx");
        // });
    };

    const exportToPDF = async () => {
        // const doc = new jsPDF({
        //     orientation: "portrait",
        //     unit: "mm",
        //     format: "a4",
        // });

        // const contentElement = document.createElement("div");
        // contentElement.innerHTML = posts?.content;
        // contentElement.style.fontFamily = "TH Sarabun, sans-serif";
        // contentElement.style.fontSize = "24px";

        // document.body.appendChild(contentElement);
        // const canvas = await html2canvas(contentElement);
        // document.body.removeChild(contentElement);

        // const imgData = canvas.toDataURL("image/png");
        // doc.addImage(imgData, "PNG", 10, 10, 190, 0);
        // doc.save("document.pdf");
    };

    // ฟังก์ชันอ่านไฟล์ `.docx` แล้วแปลงเป็น HTML
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setPosts(prevPosts => ({ ...prevPosts, content: result.value }));
            };
            reader.readAsArrayBuffer(file);
        }
    };
    // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = async (e) => {
    //             const arrayBuffer = e.target?.result as ArrayBuffer;
    //             const result = await mammoth.convertToHtml({ arrayBuffer });
    //             setPosts({content: result.value }); // แสดงผลใน Editor
    //         };
    //         reader.readAsArrayBuffer(file);
    //     }
    // };

    const saveOn = async () => {
        
        if (!posts || posts.content === "") {
            Swal.fire("กรุณากรอกข้อมูลให้ครบ", "", "info");
            return;
        }

        const data: any = {
            title: posts.title,
            content: posts.content,
            userId: user?.id
            // user_id: 4,
            // createdat: new Date()
        };
        console.log("data", data)
        const result = await Swal.fire({
            title: "ต้องการแก้ไขข้อมูลใช่หรือไม่?",
            showDenyButton: true,
            confirmButtonText: "ยืนยัน",
            denyButtonText: `ยกเลิก`
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: "กำลังบันทึก...",
                    didOpen: () => Swal.showLoading(),
                    allowOutsideClick: false
                });

                const res = await CreatePost(data);

                if (res?.success) {
                    Swal.fire("บันทึกสำเร็จ!", "", "success");
                } else {
                    Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
                }
            } catch (error: any) {
                Swal.fire("เกิดข้อผิดพลาด", error.message, "error");
            }
        } else if (result.isDenied) {
            Swal.fire("ยกเลิกรายการสำเร็จ", "", "info");
        }
    };


    return (
        <>
            <div className="flex h-screen p-4">

                {/* Sidebar - Variables */}
                <div className="w-64 bg-gray-100 p-4">

                    {/* <h1 className="text-xl font-bold">Health Records</h1>
                <div className="w-64 bg-gray-100 p-4 mt-4">
                    <h2 className="font-bold mb-4">Variables</h2>
                    <input
                        type="text"
                        placeholder="Search variables..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                    />

                    {filteredData.map((variable) => (
                        <div
                            key={variable.id}
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData("text/plain", variable.value)}
                            className="bg-white p-2 mb-2 rounded cursor-move hover:bg-gray-50"
                        >
                            {variable.label}
                        </div>
                    ))}
                </div> */}

                    {/* <h2 className="font-bold mb-4">Variables</h2>
                {data.map((variable) => (
                    <div
                        key={variable.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, variable.value)}
                        className="bg-white p-2 mb-2 rounded cursor-move hover:bg-gray-50"
                    >
                        {variable.label}
                    </div>
                ))} */}
                    {/* ปุ่มอัปโหลดไฟล์ */}
                    <input type="file" accept=".docx" onChange={handleFileUpload} className="mb-2" />
                    <button onClick={exportToWord} className="bg-blue-500 text-white p-2 rounded mt-4 w-full">
                        Export to Word
                    </button>
                    <button onClick={exportToPDF} className="bg-green-500 text-white p-2 rounded mt-4 w-full">
                        Export to PDF
                    </button>
                </div>

                <div className="flex-1 flex flex-col p-4 w-full"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <input
                        type="title"
                        placeholder="title"
                        className="w-full p-2 mb-3 border border-gray-300 rounded"
                        value={posts?.title}
                        onChange={(e) => setPosts(prevPosts => ({ ...prevPosts, title: e.target.value }))}
                    />
                    <Editor
                        apiKey="h9a0m7tta88e3l9u3s68t4zvqcs5yz69wrl9umkrkbh2hba6"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        value={posts?.content}
                        onEditorChange={handleEditorChange}
                        init={{
                            height: 500,
                            menubar: true,
                            font_formats:
                                "TH Sarabun=TH Sarabun, sans-serif; Arial=Arial, Helvetica, sans-serif; " +
                                "Tahoma=Tahoma, Geneva, sans-serif; Verdana=Verdana, Geneva, sans-serif; " +
                                "Courier New=Courier New, Courier, monospace; Times New Roman=Times New Roman, Times, serif;",
                            toolbar:
                                "fontselect fontsizeselect | bold italic underline strikethrough | " +
                                "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist outdent indent | link image media table | charmap emoticons | " +
                                "fullscreen preview | code help",
                            plugins: [
                                "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                                "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                                "insertdatetime", "media", "table", "help", "wordcount"
                            ],
                            content_style: 'body { font-family: "Sarabun", sans-serif; }',
                            font_family_formats: "Sarabun=Sarabun, sans-serif;Andale Mono=Andale Mono, monospace;Arial=Arial, Helvetica, sans-serif;Arial Black=Arial Black, Gadget, sans-serif;Book Antiqua=Book Antiqua, Palatino, serif;Comic Sans MS=Comic Sans MS, cursive, sans-serif;Courier New=Courier New, monospace;Georgia=Georgia, Palatino, serif;Helvetica=Helvetica, Arial, sans-serif;Impact=Impact, Charcoal, sans-serif;Symbol=Symbol;Tahoma=Tahoma, Arial, sans-serif;Terminal=Terminal, Monaco, monospace;Times New Roman=Times New Roman, Times, serif;Trebuchet MS=Trebuchet MS, Helvetica, sans-serif;Verdana=Verdana, Geneva, sans-serif;Webdings=Webdings;Wingdings=Wingdings, Zapf Dingbats"
                        }}
                    />
                </div>


                {/* Preview */}
                {/* <div className="w-1/3 bg-gray-50 p-4 overflow-auto">
                <h2 className="font-bold mb-4">Preview</h2>
                <div className="preview-container" dangerouslySetInnerHTML={{ __html: content }} />
            </div> */}
                <div className="flex items-end justify-end p-6 rounded-b">
                    <button className="btn bg-green-500 mr-2 w-1/6" type="button" onClick={() => saveOn()}>
                        บันทึก
                    </button>
                </div>
            </div >
        </>
    );
};

export default TemplateEditor;
