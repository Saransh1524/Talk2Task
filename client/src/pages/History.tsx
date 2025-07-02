import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import SummaryCard from "@/components/SummaryCard";
import { useToast } from "@/hooks/use-toast"

export default function History() {
  const [summaries, setSummaries] = useState([]);
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const handleDelete = async (id: string) => {
    
    try {
      await axios.delete(`/summaries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({ title: "✅ Deleted", description: "Summary removed." });
      setSummaries((prev) => prev.filter((summary:any) => summary.id !== id));
    } catch (err) {
      toast({
        title: "❌ Delete failed",
        description: "Try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const res = await axios.get("/summaries", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSummaries(res.data);
      } catch (err) {
        alert("Failed to fetch summaries");
      }
    };

    fetchSummaries();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Your Past Summaries</h1>
      {summaries.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
  📭 No summaries found. Try uploading a transcript from the Home page.
</p>
      ) : (
        summaries.map((s: any) => (
          <SummaryCard key={s.id} summary={s} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
}
