import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { getJoinableAdventureByInviteId, joinAdventure } from "~/models/adventure.server";
import { requireUser } from "~/session.server";

export async function action({ request }: ActionArgs) {
    const user = await requireUser(request);

    const formData = await request.formData();
    const inviteId = formData.get("inviteId");

    if (typeof inviteId !== "string" || inviteId.length === 0) {
        return json(
            { errors: { inviteId: "You need to add an adventure code" } },
            { status: 400 }
        );
    }

    const { adventure, error } = await getJoinableAdventureByInviteId({ inviteId, userId: user.id });

    if (error || !adventure) {
        return json(
            { errors: { inviteId: error || "Invalid invite" } },
            { status: 400 }
        );
    }

    const joinedAdventure = await joinAdventure({ id: adventure.id, userId: user.id });

    return redirect(`/adventures/${joinedAdventure.id}`);
}

export default function JoinAdventurePage() {
    const actionData = useActionData<typeof action>();
    const [searchParams] = useSearchParams();
    const inviteIdRef = React.useRef<HTMLInputElement>(null);

    const inviteId = searchParams.get("invite");

    React.useEffect(() => {
        if (actionData?.errors?.inviteId) {
            inviteIdRef.current?.focus();
        }
    }, [actionData]);

    return (
        <>
            <h2 className="text-3xl mb-2">Join an adventure</h2>

            <Form
                method="post"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    width: "100%",
                }}
            >

                <div>
                    <label className="flex w-full flex-col gap-1">
                        <span>Adventure Code </span>
                        <input
                            ref={inviteIdRef}
                            name="inviteId"
                            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                            aria-invalid={actionData?.errors?.inviteId ? true : undefined}
                            aria-errormessage={
                                actionData?.errors?.inviteId ? "invite-id-error" : undefined
                            }
                            defaultValue={inviteId || ""}
                        />
                    </label>
                    {actionData?.errors?.inviteId && (
                        <div className="pt-1 text-red-700" id="invite-id-error">
                            {actionData.errors.inviteId}
                        </div>
                    )}
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                    >
                        Join
                    </button>
                </div>
            </Form>
        </>
    );
}
