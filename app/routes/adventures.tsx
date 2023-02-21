import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

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

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Navbar />

      <main className="flex h-full">
        <div className="h-full w-80 border-r">
          <Link to="new" className="link link-secondary no-underline text-xl px-4">
            + Start an Adventure
          </Link>

          <div className="divider"></div> 

          {data.adventureListItems.length === 0 ? (
            <p className="p-4">No adventures yet</p>
          ) : (
            <ol>
              {data.adventureListItems.map((adventure) => (
                <li key={adventure.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `link no-underline text-xl px-4 ${isActive ? "link-primary" : ""}`
                    }
                    to={adventure.id}
                  >
                    {adventure.adventureTemplate.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
