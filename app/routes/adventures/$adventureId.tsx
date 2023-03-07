import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAdventure } from "~/models/adventure.server";
import { requireUserId } from "~/session.server";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from "react";
import { createNotificationWithTitleAndDescription } from "~/utils/notifications";

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
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">{data.adventure.adventureTemplate.title}</h1>
            <p className="py-6">{data.adventure.adventureTemplate.description}</p>
            <CopyToClipboard
              text={inviteUrl}
              onCopy={() => { createNotificationWithTitleAndDescription({ title: "Copied invite link", description: "Share it with other adventurers."}) }}
            >
              <button className="btn btn-primary">
                Invite Adventurers
              </button>
            </CopyToClipboard>
          </div>
        </div>
      </div>
      {/* <div>
        <h4 className="text-md my-2">Adventurers:</h4>
        <ul>
          <li>{data.adventure.creator.email} (owner)</li>
          {data.adventure.joiners.map(joiner =>
            <li key={joiner.email}>{joiner.email}</li>
          )
          }
        </ul>
      </div> */}
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
