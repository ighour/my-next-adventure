import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteAdventure, getAdventure } from "~/models/adventure.server";
import { getChallengeListItems } from "~/models/challenge.server";
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

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.adventureId, "adventureId not found");

  await deleteAdventure({ userId, id: params.adventureId });

  return redirect("/adventures");
}

export default function AdventureDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.adventure.adventureTemplate.title}</h3>
      <p className="py-6">{data.adventure.adventureTemplate.description}</p>
      <p className="py-6">Adventurers:</p>
      <ul>
        {data.adventure.users.map(user => <li key={user.email}>{user.email}</li>)}
      </ul>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
      <hr className="my-4" />
      <h4 className="text-xl font-bold">Challenges</h4>
      <ol>
        {data.challenges.map((challenge) => (
          <li key={challenge.id}>
            {challenge.revealed ?
              <Link
                className="block border-b p-4 text-xl"
                to={`challenges/${challenge.id}`}
              >
                {challenge.challengeTemplate.title}{challenge.completed ? " (Completed)" : ""}
              </Link>
              :
              <div
                className="block border-b p-4 text-xl text-gray-500"
              >
                {challenge.challengeTemplate.title}
              </div>
            }

          </li>
        ))}
      </ol>
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
