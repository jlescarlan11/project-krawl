import { ProtectedRoute } from "@/components/navigation";
import { KrawlCreationFlow } from "@/components/krawl-creation/KrawlCreationFlow";

export default function CreateKrawlPage() {
  return (
    <ProtectedRoute>
      <KrawlCreationFlow />
    </ProtectedRoute>
  );
}

