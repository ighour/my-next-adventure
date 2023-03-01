import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { completeChallenge, revealChallenge, updateNote } from "~/models/challenge.server";
import { requireUserId } from "~/session.server";

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

    } else if (_action === "update-note") {
        const note = formData.get("note");

        if (typeof note !== "string" || note.length === 0) {
            return json(
                { errors: { note: "Invalid note" } },
                { status: 400 }
            );
        }

        await updateNote({ userId, note, id: params.challengeId });
        return null

    } else if (_action === "remove-note") {
        await updateNote({ userId, note: null, id: params.challengeId });
        return null

    }
}
