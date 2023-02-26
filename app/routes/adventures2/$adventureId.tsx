import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ChallengeListItem from "~/components/ChallengeListItem";

import { getAdventure } from "~/models/adventure.server";
import { completeChallenge, getChallengeListItems, revealChallenge, updateNote } from "~/models/challenge.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.adventureId, "adventureId not found");

  const adventure = await getAdventure({ userId, id: params.adventureId });
  if (!adventure) {
    throw new Response("Not Found", { status: 404 });
  }

  const challenges = await getChallengeListItems({ userId, adventureId: adventure.id });

  return json({ adventure, challenges });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { _action, _challengeId } = Object.fromEntries(formData);

  if (_action === "reveal") {
    await revealChallenge({ userId, id: _challengeId.toString() });
    return null

  } else if (_action === "complete") {
    await completeChallenge({ userId, id: _challengeId.toString() });
    return null

  } else if (_action === "update-note") {
    const note = formData.get("note");

    if (typeof note !== "string" || note.length === 0) {
      return json(
        { errors: { _challengeId, note: "Invalid note" } },
        { status: 400 }
      );
    }

    await updateNote({ userId, note, id: _challengeId.toString() });
    return null

  } else if (_action === "remove-note") {
    await updateNote({ userId, note: null, id: _challengeId.toString() });
    return null

  }
}

// @TODO - get automatically from action
export type TActionErrorData = { _challengeId: string, note?: string };

export default function AdventureDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const errors = actionData && 'errors' in actionData ? actionData.errors as TActionErrorData : null;

  const getAction = ({ completed, revealed }: { completed: boolean, revealed: boolean}) => {
    if (completed) {
      return null
    }
    if (revealed) {
      return  { text: "Mark as done", name: "complete" }
    }
    return  { text: "Reveal it", name: "reveal" }
  }

  const getErrorForChallenge = (id: string) => {
    if (!errors) { return }
    const { _challengeId: challengeIdWithErrors } = errors
    if (id === challengeIdWithErrors) {
      return errors
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {data.challenges.map((challenge, index) =>
        <ChallengeListItem
          index={index}
          className="mx-2 my-4"
          key={challenge.id}
          id={challenge.id}
          title={`#${challenge.challengeTemplate.position+1} ${challenge.challengeTemplate.title}`}
          description={challenge.challengeTemplate.description}
          notePlaceholder={challenge.challengeTemplate.notePlaceholder}
          completed={challenge.completed}
          revealed={challenge.revealed}
          note={challenge.note}
          action={getAction(challenge)}
          errors={getErrorForChallenge(challenge.id)}
        />  
      )}
    </div>
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
