import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAdventure } from "~/models/adventure.server";
import { requireUserId } from "~/session.server";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from "react";
import { createNotificationWithTitleAndDescription } from "~/utils/notifications";
import AdventureModal, { AdventureModalOpener } from "~/components/AdventureModal";

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

  const joiners = data.adventure.joiners.map(joiner => joiner.email);

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">{data.adventure.title}</h1>
            <p className="py-6">{data.adventure.description}</p>
            <div>
              <CopyToClipboard
                text={data.adventure.inviteId}
                onCopy={() => { createNotificationWithTitleAndDescription({ title: "Copied adventure invite link", description: "Share it with other adventurers." }) }}
              >
                <button className="btn btn-primary mx-1 my-1">
                  Invite Code
                </button>
              </CopyToClipboard>
              <AdventureModalOpener className="mx-1 my-1" />
            </div>
          </div>
        </div>
      </div>
      <AdventureModal
        title={data.adventure.title}
        inviteId={data.adventure.inviteId}
        maxJoiners={data.adventure.maxJoiners}
        creator={data.adventure.creator.email}
        joiners={joiners}
      />
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
