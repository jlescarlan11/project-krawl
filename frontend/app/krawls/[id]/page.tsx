export default async function KrawlDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Krawl Detail</h1>
      <p className="text-text-secondary">
        Krawl detail page - to be implemented in TASK-071
      </p>
      <p className="text-text-tertiary mt-2">Krawl ID: {id}</p>
    </div>
  );
}

