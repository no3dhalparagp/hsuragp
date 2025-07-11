// app/page.tsx
import VillageReport from '@/components/VillageReport';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Village Population Report</h1>
      <VillageReport />
    </main>
  );
}
