import { client } from "@/sanity/lib/client";
import { QueryParams } from "next-sanity";
import { notFound } from "next/navigation";

// Define TypeScript interface for the franchise data
interface Franchise {
  _id: string;
  franchise_name: string;
  // Add other fields you need from your schema
}

// Query to get a single franchise by name
const FRANCHISE_QUERY = `*[_type == "weedManFranchiseType" && path.current == $franchise][0]`;

// Query to get all franchise names for generateStaticParams
const ALL_FRANCHISES_QUERY = `*[_type == "weedManFranchiseType"] {
    "path":path.current
}`;

// Generate static paths at build time
export async function generateStaticParams() {
  const franchises = await client.fetch(ALL_FRANCHISES_QUERY);
  return franchises.map((franchise: { path: string }) => ({
    franchise: franchise.path,
  }));
}

// Enable ISR with a 60-second revalidation period
export const revalidate = 1;

export default async function FranchisePage({
  params,
}: {
  params: Promise<QueryParams>;
}) {
  const { franchise } = await params;
  const franchiseData: Franchise = await client.fetch(FRANCHISE_QUERY, {
    franchise: franchise,
  });

  // Handle 404 if franchise not found
  if (!franchise) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {franchiseData.franchise_name}
      </h1>
      {/* Add more franchise details here */}
    </main>
  );
}
