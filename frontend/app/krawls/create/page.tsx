import { ProtectedRoute } from "@/components/navigation";

export default function CreateKrawlPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Create Krawl</h1>
        <p className="text-text-secondary">
          Krawl creation form - to be implemented in TASK-100
        </p>
      </div>
    </ProtectedRoute>
  );
}

