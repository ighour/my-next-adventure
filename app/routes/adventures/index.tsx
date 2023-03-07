import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getCreatedAdventureListItems, getJoinedAdventureListItems } from "~/models/adventure.server";

export async function loader({ request }: LoaderArgs) {
    const userId = await requireUserId(request);
    const createdAdventureListItems = await getCreatedAdventureListItems({ userId });
    const joinedAdventureListItems = await getJoinedAdventureListItems({ userId });
    return json({ createdAdventureListItems, joinedAdventureListItems });
}

export default function AdventuresIndexPage() {
    const data = useLoaderData<typeof loader>();

    return (
        <ul>
            <li>My Next Adventure:</li>
            <li>
                <Link
                    className="link text-xl px-4"
                    to="new"
                >
                    Start a new adventure
                </Link>
            </li>
            <li>
                <Link
                    className="link text-xl px-4"
                    to="join"
                >
                    Join an adventure
                </Link>
            </li>
            <div className="divider"></div>
            <li>My Adventures (Owner):</li>
            {data.createdAdventureListItems.map(adventure =>
                <li key={adventure.id}>
                    <Link
                        className="link text-xl px-4"
                        to={adventure.id}
                    >
                        {adventure.adventureTemplate.title}
                    </Link>
                </li>
            )}
            <div className="divider"></div>
            <li>My Adventures (Joiner):</li>
            {data.joinedAdventureListItems.map(adventure =>
                <li key={adventure.id}>
                    <Link
                        className="link text-xl px-4"
                        to={adventure.id}
                    >
                        {adventure.adventureTemplate.title}
                    </Link>
                </li>
            )}
        </ul>
    );
}
