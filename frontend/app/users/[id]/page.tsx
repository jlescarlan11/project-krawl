export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p className="text-text-secondary">
        User profile page - to be implemented in TASK-157
      </p>
      <p className="text-text-tertiary mt-2">User ID: {id}</p>
    </div>
  );
}

