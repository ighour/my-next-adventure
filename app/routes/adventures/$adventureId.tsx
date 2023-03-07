import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAdventure } from "~/models/adventure.server";
import { requireUserId } from "~/session.server";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";

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
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location) {
      setFullUrl(window.location.protocol + '//' + window.location.host)
    }
  }, []);

  const inviteUrl = `${fullUrl}/adventures/join?invite=${data.adventure.inviteId}`

  return (
    <>
      <h2 className="text-3xl mb-2">{data.adventure.adventureTemplate.title}</h2>
      <div className="flex items-center my-2">
        <div> Your adventure code is <span className="underline">{data.adventure.inviteId}</span> </div>
        <CopyToClipboard
          text={inviteUrl}
        >
          <button className="btn btn-sm btn-ghost btn-circle">
            <ClipboardIcon className="h-6 w-6" />
          </button>
        </CopyToClipboard>
      </div>
      <div>
        <h4 className="text-md my-2">Adventurers:</h4>
        <ul>
          <li>{data.adventure.creator.email} (owner)</li>
          {data.adventure.joiners.map(joiner =>
            <li key={joiner.email}>{joiner.email}</li>
          )
          }
        </ul>
      </div>
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
