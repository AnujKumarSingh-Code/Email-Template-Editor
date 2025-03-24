"use client";

import { useEffect, useRef, useState } from "react";
import { ShootmailEditor } from "@shootmail/email-builder";
import "@shootmail/email-builder/dist/shootmail.css";

export default function Home() {
  const editorRef = useRef<ShootmailEditor | null>(null);


  const [htmlValue, setHtmlValue] = useState("");
  
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !editorRef.current) {

      const editor = new ShootmailEditor({
        elementId: "shootmail-editor",
        settingsControl: true,
        
        theme: {
          borderRadius: "8",
          padding: true,
          light: {

            editorBackground: "#ffffff",
            editorBorder: "#e2e8f0",
            
            emailBackground: "#ffffff",
          },
          dark: {
            editorBackground: "#1e293b",
            editorBorder: "#334155",
            emailBackground: "#0f172a",
          },
        },
      });

      editorRef.current = editor;
    }

    
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  
  const handleLoadFromEditor = () => {
    if (!editorRef.current) return;
    
    const currentHtml = editorRef.current.getHTML();
    setHtmlValue(currentHtml);
  };

  
  const handleApplyToEditor = () => {
    if (!editorRef.current) return;
    
    (editorRef.current as any).setContent(htmlValue);
  };

  
  const handlePreviewEmail = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHTML();
    console.log("Preview HTML:", html);
    alert("Check console for the HTML preview!");
  };

 
const handleSaveTemplate = async () => {
  if (!editorRef.current) return;
  const contentHTML = editorRef.current.getHTML();

  const name = prompt("Enter a name for this template:", "MyShootmailTemplate");
  if (!name) return;

  try {
    const response = await fetch("https://iwojpgsdff.execute-api.ap-south-1.amazonaws.com/dev/api/fitnearn/web/admin/createTemplate", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        contentHTML,
        subject, 
      }),
    });
    const data = await response.json();
    if (data.error) {
      alert("Error saving template: " + data.error);
    } else {
      alert("Template saved + SES template created!");
    }
  } catch (error) {
    console.error("Save error:", error);
    alert("Failed to save. Check console.");
  }
};


  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col mb-6">
          <h1 className="text-2xl font-bold mb-2">Email Template Editor </h1>

          
          <div className="flex items-center mb-4 text-green-500">
            <label className="mr-2">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-2 py-1 border rounded-md flex-1"
              placeholder="Enter email subject..."
            />
          </div>

          <div className="space-x-4">
            <button
              onClick={handlePreviewEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Preview Email
            </button>
            <button
              onClick={handleSaveTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Template
            </button>
          </div>
        </div>

        
        <div className="flex gap-6">
          
          <div className="w-1/2 border rounded-lg shadow-sm p-2">
            <h2 className="text-xl font-bold mb-2">Editor</h2>
            <div
              id="shootmail-editor"
              style={{ minHeight: "50vh" }}
              className="border rounded"
            />
            <div className="mt-4 space-x-2">
              <button
                onClick={handleLoadFromEditor}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Load HTML from Editor
              </button>
              <button
                onClick={handleApplyToEditor}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Apply HTML to Editor
              </button>
            </div>
          </div>

          
          <div className="w-1/2 flex flex-col">
            <h2 className="text-xl font-bold mb-2">Raw HTML</h2>
            <textarea
              className="border rounded-lg p-2 flex-1 bg-black text-white"
              placeholder="Editor HTML goes here..."
              value={htmlValue}
              onChange={(e) => setHtmlValue(e.target.value)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
