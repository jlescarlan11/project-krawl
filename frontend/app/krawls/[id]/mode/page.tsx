import { KrawlModeClient } from "./KrawlModeClient";
import { fetchKrawlById } from "@/lib/api/krawls";

export default async function KrawlModePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const krawl = await fetchKrawlById(id);

  if (!krawl) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Krawl Not Found</h1>
        <p className="text-text-secondary">The requested Krawl could not be found.</p>
      </div>
    );
  }

  return <KrawlModeClient krawlId={id} krawl={krawl} />;
}
