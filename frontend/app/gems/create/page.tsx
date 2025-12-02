import { ProtectedRoute } from "@/components/navigation";
import { GemCreationFlow } from "@/components/gem-creation/GemCreationFlow";

export default function CreateGemPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-white">
        <GemCreationFlow />
      </div>
    </ProtectedRoute>
  );
}

