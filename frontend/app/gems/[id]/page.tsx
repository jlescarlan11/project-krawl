export default async function GemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Gem Detail</h1>
      <p className="text-text-secondary">
        Gem detail page - to be implemented in TASK-061
      </p>
      <p className="text-text-tertiary mt-2">Gem ID: {id}</p>
    </div>
  );
}

