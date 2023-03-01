import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getAdventureListItems } from "~/models/adventure.server";
import Navbar from "~/components/Navbar";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const adventureListItems = await getAdventureListItems({ userId });
  return json({ adventureListItems });
}

export default function AdventuresPage() {
  const data = useLoaderData<typeof loader>();
  console.log(data)
  return (
    <div className="flex flex-col h-full min-h-screen">
      <Navbar />

      <main className="h-full min-h-screen bg-base-200 p-6">
        <Outlet />
      </main>
    </div>
  );
}
