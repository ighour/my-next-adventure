import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getAdventureListItems } from "~/models/adventure.server";

export async function loader({ request }: LoaderArgs) {
    const userId = await requireUserId(request);
    const adventureListItems = await getAdventureListItems({ userId });
    return json({ adventureListItems });
}

export default function AdventuresIndexPage() {
    const data = useLoaderData<typeof loader>();

    return (
        <ul>
            <Link
                className="link text-xl px-4"
                to="new"
            >
                + New adventure
            </Link>
            {data.adventureListItems.map(adventure =>
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
