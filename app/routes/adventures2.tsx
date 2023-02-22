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
    <div className="flex h-full min-h-screen flex-col">
      <Navbar />

      <main className="flex h-full">
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
