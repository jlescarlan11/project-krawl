import { ProtectedRoute } from "@/components/navigation";

export default function CreateGemPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Create Gem</h1>
        <p className="text-text-secondary">
          Gem creation form - to be implemented in TASK-087
        </p>
      </div>
    </ProtectedRoute>
  );
}

