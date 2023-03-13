import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { clsx } from "clsx";
import * as React from "react";

import { getJoinableAdventureByInviteCode, joinAdventure } from "~/models/adventure.server";
import { requireUser } from "~/session.server";

export async function action({ request }: ActionArgs) {
    const user = await requireUser(request);

    const formData = await request.formData();
    const code = formData.get("code");

    if (typeof code !== "string" || code.length === 0) {
        return json(
            { errors: { code: "You need to add an adventure code" } },
            { status: 400 }
        );
    }

    const { adventure, error } = await getJoinableAdventureByInviteCode({ code, userId: user.id });

    if (error || !adventure) {
        return json(
            { errors: { code: error || "Invalid invite" } },
            { status: 400 }
        );
    }

    const joinedAdventure = await joinAdventure({ id: adventure.id, userId: user.id });

    return redirect(`/adventures/${joinedAdventure.id}`);
}

export const meta: MetaFunction = () => {
    return {
        title: "Join Adventure",
    };
};

export default function JoinAdventurePage() {
    const actionData = useActionData<typeof action>();
    const codeRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (actionData?.errors?.code) {
            codeRef.current?.focus();
        }
    }, [actionData]);

    return (
        <div className="mx-auto w-full max-w-md px-8">
            <h2 className="text-2xl mb-5">Join an Adventure</h2>
            <Form
                method="post"
                className="space-y-6"
            >
                <div className="form-control w-full">
                    <label className="label" htmlFor="code">
                        <span className="label-text">Adventure Code</span>
                    </label>
                    <input
                        ref={codeRef}
                        id="code"
                        required
                        autoFocus={true}
                        name="code"
                        type="text"
                        aria-invalid={actionData?.errors?.code ? true : undefined}
                        aria-describedby="code-error"
                        className={clsx("input input-bordered", `${actionData?.errors?.code ? "input-error" : ""}`)}
                        placeholder="s2A52..."
                    />
                    {actionData?.errors?.code && (
                        <div className="pt-1 text-red-700" id="code-error">
                            {actionData.errors.code}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-block btn-circle btn-primary"
                >
                    Join
                </button>
            </Form>
        </div>
    );
}
