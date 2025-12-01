import { ProtectedRoute } from "@/components/navigation";
import { GemCreationFlow } from "@/components/gem-creation/GemCreationFlow";

export default function CreateGemPage() {
  return (
    <ProtectedRoute>
      <div className="fixed inset-0 z-10 bg-bg-white">
        <GemCreationFlow />
      </div>
    </ProtectedRoute>
  );
}

