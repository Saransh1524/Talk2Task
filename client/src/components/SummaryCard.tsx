
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // optional icon

// Type for the summary object
type Props = {
  summary: {
    id: string;
    transcript: string;
    result: string;
    createdAt: string;
  };
  onDelete: (id: string) => void; // 👈 delete handler from parent
};

export default function SummaryCard({ summary, onDelete }: Props) {
  

  const deleteFunction = () => {
    if (confirm("Are you sure you want to delete this summary?")) {
      onDelete(summary.id);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{new Date(summary.createdAt).toLocaleString()}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={deleteFunction}
            className="ml-auto"
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
        </div>
        <div>
          <strong className="block text-sm text-muted-foreground mb-1">Transcript</strong>
          <p className="text-sm">{summary.transcript.slice(0, 200)}...</p>
        </div>
        <div>
          <strong className="block text-sm text-muted-foreground mb-1">Summary</strong>
          <pre className="whitespace-pre-wrap text-sm">{summary.result}</pre>
        </div>
      </CardContent>
    </Card>
  );
}
