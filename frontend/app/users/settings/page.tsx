import { ProtectedRoute } from "@/components/navigation";

export default function UserSettingsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
        <p className="text-text-secondary">
          Profile settings page - to be implemented in TASK-166
        </p>
      </div>
    </ProtectedRoute>
  );
}

