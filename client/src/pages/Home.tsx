// import { useToast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast"
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import axios from "@/lib/axios";
import { Textarea } from "@/components/ui/textarea"; // Importing Textarea component from shadcn/ui
import { Button } from "@/components/ui/button"; // shandCn ui component
import ResultCard from "@/components/ResultCard"; 
import { useRef } from "react";
export default function Home() {
   const fileInputRef = useRef<HTMLInputElement>(null);// reference to the file input element
  const [transcript, setTranscript] = useState(""); // store the transcript text
  const [loading1, setLoading1] = useState(false); // changes button to summarizing if true and summarize if false 
  const [loading2, setLoading2] = useState(false); 
  const [result, setResult] = useState(""); // result of the summarization stored here 
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSummarize = async () => {
    setLoading1(true);
    try {
      const res = await axios.post("/summarize", { transcript }); // post req to /sumarize endpoint with transcript as body
      // res.data.result contains the summarized text
      setResult(res.data.result);
    } catch (err) {
      alert("Failed to summarize");
    setLoading1(false);
  }finally {
      setLoading1(false);
    }
    }


  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!transcript || !result) {
      setMessage("Transcript or summary is missing.");
      return;
    }

    try {
      setLoading2(true);
      setMessage("");

      await axios.post("/summaries", {
        transcript: transcript,
        result: result,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      toast({
  title: "✅ Summary saved",
  description: "Your summary was saved successfully!",
});
    } catch (err) {
       toast({
        title: "❌ Error",
        description: "Failed to save summary.",
        variant: "destructive",
      });
    } finally {
      setLoading2(false);
    }
  };


  // file upload function
  //async function taking react event as parameter

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
  const file = acceptedFiles[0];
  if (!file) return;

  const ext = file.name.split(".").pop()?.toLowerCase();
  const reader = new FileReader();

  if (ext === "txt") {
    reader.onload = () => setTranscript(reader.result as string);
    reader.readAsText(file);
  } else if (ext === "pdf") {
    try {
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const typedarray = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((s: any) => s.str).join(" ") + "\n";
      }

      setTranscript(text);
      toast({ title: "✅ PDF Uploaded", description: file.name });
    } catch (error) {
      toast({ title: "❌ PDF Parse Failed", description: "Try another PDF", variant: "destructive" });
    }
  } else if (ext === "docx") {
    try {
      const mammoth = await import("mammoth");
      const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      const plainText = result.value.replace(/<[^>]+>/g, "");
      setTranscript(plainText);
      toast({ title: "✅ DOCX Uploaded", description: file.name });
    } catch (error) {
      toast({ title: "❌ DOCX Parse Failed", description: "Try another file", variant: "destructive" });
    }
  } else {
    toast({ title: "Unsupported File", description: "Only .txt, .pdf, .docx allowed", variant: "destructive" });
  }
}, []);

//const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': [], 'text/plain': [], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [] } });

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  maxSize: 2 * 1024 * 1024, // ✅ 2MB in bytes
  accept: {
    'application/pdf': [],
    'text/plain': [],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': []
  },
  onDropRejected: (fileRejections) => {
    toast({
      title: "❌ File size too large",
      description: `Please upload files under 2MB.`,
      variant: "destructive",
    });
  },
});


  return (
    <div className="max-w-4xl mx-auto p-4 mt-10 ">
      <h1 className="text-4xl font-bold mb-6">Talk2Task — AI Transcript Summarizer</h1>

      <div
  {...getRootProps()}
  className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-all mb-4"
>
  <input {...getInputProps()} />
  {isDragActive ? (
    <p className="text-blue-600 font-medium">Drop the file here...</p>
  ) : (
    <p className="text-gray-400">Drag & drop a transcript file here, or click to select (.txt, .pdf, .docx)</p>
  )}
</div>

      <Textarea
        className="min-h-[250px] mb-4 !text-lg placeholder:text-lg placeholder:text-gray-400"
        placeholder="Paste your transcript here..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />
      <Button  className = "mr-4 text-lg" onClick={handleSummarize} disabled={loading1}>
        {loading1 ? "Summarizing..." : "Summarize"}
      </Button>
       {/* Save Button */}
      <Button className = "mr-4 text-lg" onClick={handleSave} disabled={loading2}>
        {loading2 ? "Saving..." : "💾 Save Result"}
      </Button>
      {result && <ResultCard result={result} />}
    </div>
  );
}
  
