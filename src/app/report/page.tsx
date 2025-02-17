// pages/posts.tsx
"use client";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), { ssr: false });
import { useEffect, useState } from "react";
import Select from 'react-select'

interface Post {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        method: "GET"
      });
      console.log("response", response)
      const data = await response.json();
      setPosts(data);

      // const res = await fetch("/api/auth/login", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ username, password }),
      // });
    };

    fetchPosts();
  }, []);

  const handleShowContent = (content: string | null) => {
    setContent(content ?? ""); // ถ้า content เป็น null ให้เป็น string ว่าง
  };

  return (<>
    <Navbar />
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Posts</h1>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            {/* <th className="py-2 px-4 border-b">Content</th> */}
            <th className="py-2 px-4 border-b">Created At</th>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{post.id}</td>
              <td className="py-2 px-4 border-b">{post.title}</td>
              {/* <td className="py-2 px-4 border-b">{post.content ?? "No content"}</td> */}
              <td className="py-2 px-4 border-b">{new Date(post.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{post.user.name}</td>
              <td className="py-2 px-4 border-b">
                {/* ปุ่ม Action */}
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleShowContent(post.content)}
                >
                  Show Content
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* แสดงผลใน input */}
      <div className="mt-6">
        <Editor
          apiKey="h9a0m7tta88e3l9u3s68t4zvqcs5yz69wrl9umkrkbh2hba6"
          //onInit={(evt, editor) => (editorRef.current = editor)}
          value={content}
          // onEditorChange={handleEditorChange}
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
    </div>
    <Select options={options} isMulti
    name="colors"
    className="basic-multi-select"
    classNamePrefix="select" />
    <div className="flex items-end justify-end p-6 rounded-b">
      <button className="btn bg-green-400 mr-2 w-1/6" type="button">
        Send To 
      </button>
    </div>
  </>
  );
};

export default PostsPage;
