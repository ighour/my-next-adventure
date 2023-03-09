import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAdventure } from "~/models/adventure.server";
import { requireUserId } from "~/session.server";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createNotificationWithTitleAndDescription } from "~/utils/notifications";
import Modal, { ModalOpener } from "~/components/Modal";

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

  const modalId = "my-adventure";

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
              <ModalOpener
                id={modalId}
                buttonName="Info"
                className="mx-1 my-1 btn-secondary"
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        id={modalId}
      >
        <h2 className="text-xl font-bold mb-2">{data.adventure.title}</h2>
        <ul className="space-y-2 text-md">
          <li>
            1. You can invite other people to your adventure by using the code <span className="underline font-semibold">{data.adventure.inviteId}</span>
          </li>
          <li>
            2. This adventure is limited to <span className="underline font-semibold">{data.adventure.maxJoiners + 1}</span> people
          </li>
          <li>
            3. Adventure creator is <span className="underline font-semibold">{data.adventure.creator.email}</span>
          </li>
        </ul>
        {joiners.length > 0 &&
          <>
            <div className="mt-2">4. Other adventurers are:</div>
            <ul className="space-y-2 text-md">
              {joiners.map(joiner =>
                <li key={joiner}>
                  - {joiner}
                </li>
              )}
            </ul>
          </>
        }
      </Modal>
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
