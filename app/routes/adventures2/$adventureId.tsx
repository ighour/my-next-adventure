import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAdventure } from "~/models/adventure.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.adventureId, "adventureId not found");

  const adventure = await getAdventure({ userId, id: params.adventureId });
  if (!adventure) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ adventure });
}

export default function AdventureDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <h2 className="text-3xl mb-2">{data.adventure.adventureTemplate.title}</h2>
      <NavLink
        className={({ isActive }) =>
          `link mb-2 ${isActive ? "font-bold" : ""}`
        }
        to="challenges"
      >
        Challenges
      </NavLink>
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Adventure not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
