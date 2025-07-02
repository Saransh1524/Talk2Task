export default function ResultCard({ result }: { result: string }) {
  return (
    <div className="mt-6 p-4  rounded-xl border">
      <h2 className="text-xl font-semibold mb-2">Summarized Output</h2>
      <pre className="whitespace-pre-wrap">{result}</pre>
    </div>
  );
}
