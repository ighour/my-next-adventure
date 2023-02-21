import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";

import { completeChallenge, getChallenge, revealChallenge, updateNote } from "~/models/challenge.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.challengeId, "challengeId not found");

  const challenge = await getChallenge({ userId, id: params.challengeId });
  if (!challenge) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ challenge });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.challengeId, "challengeId not found");

  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);

  if (_action === "reveal") {
    await revealChallenge({ userId, id: params.challengeId });
    return null

  } else if (_action === "complete") {
    await completeChallenge({ userId, id: params.challengeId });
    return null

  } else if (_action === "note") {
    const note = formData.get("note");

    if (typeof note !== "string" || note.trim().length === 0) {
      return json(
        { errors: { note: "You need to add a valid note" } },
        { status: 400 }
      );
    }
    await updateNote({ userId, id: params.challengeId, note });
    return null
  }
}

export default function ChallengeDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const noteRef = React.useRef<HTMLTextAreaElement>(null);

  const errors = actionData && 'errors' in actionData ? actionData.errors as Record<string, string> : null;

  React.useEffect(() => {
    if (errors?.note) {
      noteRef.current?.focus();
    }
  }, [errors]);

  if (!data.challenge.revealed) {
    return (
      <div>
        <h3 className="text-2xl font-bold">{data.challenge.challengeTemplate.title}</h3>
        <p className="py-6 underline">(hidden)</p>
        <Form method="post">
          <button
            type="submit"
            name="_action"
            value="reveal"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Reveal
          </button>
        </Form>
      </div>
    );
  }

  if (!data.challenge.completed) {
    return (
      <div>
        <h3 className="text-2xl font-bold">{data.challenge.challengeTemplate.title}</h3>
        <p className="py-6">{data.challenge.challengeTemplate.description}</p>
        <Form method="post">
          <button
            type="submit"
            name="_action"
            value="complete"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Complete
          </button>
        </Form>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.challenge.challengeTemplate.title} (Completed)</h3>
      <p className="py-6">{data.challenge.challengeTemplate.description}</p>
      <hr className="my-2" />
      <Form method="post">
        <div className="mb-3">
          <label className="flex w-full flex-col gap-1">
            <span>Notes: </span>
            <textarea
              ref={noteRef}
              name="note"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              aria-invalid={errors?.note ? true : undefined}
              aria-errormessage={
                errors?.note ? "note-error" : undefined
              }
            >{data.challenge.note}</textarea>
          </label>
          {errors?.note && (
            <div className="pt-1 text-red-700" id="note-error">
              {errors.note}
            </div>
          )}
        </div>
        <button
          type="submit"
          name="_action"
          value="note"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save note
        </button>
      </Form>
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
    return <div>Challenge not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
