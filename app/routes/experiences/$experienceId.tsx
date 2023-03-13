import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAdventure } from "~/models/adventure.server";
import { requireUserId } from "~/session.server";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createNotificationWithTitleAndDescription } from "~/utils/notifications";
import Modal, { ModalOpener } from "~/components/Modal";
import { getOrCreateValidInviteFromAdventure } from "~/models/invite.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.experienceId, "adexperienceIdventureId not found");

  const adventure = await getAdventure({ userId, id: params.experienceId });
  if (!adventure) {
    throw new Response("Not Found", { status: 404 });
  }

  const invite = await getOrCreateValidInviteFromAdventure({
    adventureId: params.experienceId,
    maxJoiners: adventure.maxJoiners,
    currentJoinersCount: adventure.joiners.length,
  });

  return json({ adventure, invite });
}

export default function AdventureDetailsPage() {
  const data = useLoaderData<typeof loader>();

  const joiners = data.adventure.joiners.map(joiner => `@${joiner.username}`);

  const modalId = "my-adventure";

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">{data.adventure.title}</h1>
            <p className="py-6">{data.adventure.description}</p>
            <div>
              {data.invite &&
                <CopyToClipboard
                  text={data.invite.code}
                  onCopy={() => { createNotificationWithTitleAndDescription({ title: "Copiou o Código de Convite", description: "Compartilhe com outros aventureiros." }) }}
                >
                  <button className="btn btn-primary mx-1 my-1">
                    Código de Convite
                  </button>
                </CopyToClipboard>
              }
              <ModalOpener
                id={modalId}
                buttonName="Detalhes"
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
          {data.invite &&
            <li>
              1. Você pode convidar outros aventureiros para a sua experiência compartilhando o código de convite <span className="underline font-semibold">{data.invite.code}</span>
            </li>
          }
          {!data.invite &&
            <li>
              1. Sua experiência está com todos os aventureiros
            </li>
          }
          <li>
            2. Essa experiência é limitada a <span className="underline font-semibold">{data.adventure.maxJoiners + 1}</span> aventureiros
          </li>
          <li>
            3. O organizador da experiência é <span className="underline font-semibold">@{data.adventure.creator.username}</span>
          </li>
        </ul>
        {joiners.length > 0 &&
          <>
            <div className="mt-2">4. Cúmplices da experiência:</div>
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
