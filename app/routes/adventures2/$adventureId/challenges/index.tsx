import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

import { getAdventure } from "~/models/adventure.server";
import { completeChallenge, getChallengeListItems, revealChallenge, updateNote } from "~/models/challenge.server";
import { requireUserId } from "~/session.server";
import { ClockIcon, CurrencyDollarIcon, SunIcon } from '@heroicons/react/24/outline'

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

interface IChallengeListItemProps {
    id: string
    title: string
    description: string
    notePlaceholder: string | null
    completed: boolean
    revealed: boolean
    note: string | null
    action: {
        text: string
        name: string
    } | null
    errors?: TActionErrorData
    className?: string
};

function ChallengeListItem({ id, title, description, notePlaceholder, completed, revealed, note, action, errors, className }: IChallengeListItemProps) {
    const [modifyingNote, setModifyingNote] = useState(note ?? "");

    const noteRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (errors?.note) {
            noteRef.current?.focus();
        }
    }, [errors]);

    const handleChangeModifyingNote = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setModifyingNote(() => event.target.value);
    }

    return (
        <div className={clsx(className)}>
            <div className="flex items-end">
                <div className="flex flex-col items-end">
                    <div className="flex justify-center space-x-5 w-96 mb-1 font-semibold">
                        <span className="flex items-center">
                            <CurrencyDollarIcon className="h-6 w-6 mr-1"/> FREE
                        </span>
                        <span className="flex items-center">
                            <SunIcon className="h-6 w-6 mr-1"/> ANY
                        </span>
                        <span className="flex items-center">
                            <ClockIcon className="h-6 w-6 mr-1"/> 1HR
                        </span>
                    </div>
                    <div className="card lg:card-side bg-base-100 shadow-xl">
                        <figure>
                            <img
                                src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
                                alt="TODO"
                            />
                        </figure>
                        <div className="card-body w-96 h-96">
                            <h2 className="card-title px-2">{title}</h2>
                            <div className={clsx("space-y-4 h-64 overflow-y-auto px-1", `${!revealed ? "blur-sm" : ""}`)} dangerouslySetInnerHTML={{ __html: description }} />
                            {action &&
                                <div className="card-actions justify-end">
                                    <Form method="post">
                                        <input type="hidden" name="_challengeId" value={id} />
                                        <button
                                            type="submit"
                                            name="_action"
                                            value={action.name}
                                            className="btn btn-primary"
                                        >
                                            {action.text}
                                        </button>
                                    </Form>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start space-y-5 h-96 ml-2">
                    <span>TAG</span>
                    <span>TAG</span>
                    <span>TAG</span>
                </div>
            </div>
            {completed &&
                <div className="form-control my-2">
                    <Form method="post">
                        <input type="hidden" name="_challengeId" value={id} />
                        <label className="label">
                            <span className="label-text-alt">{notePlaceholder ?? "How was the challenge?"}</span>
                        </label>
                        <textarea
                            ref={noteRef}
                            name="note"
                            className="textarea resize-none w-full h-20 textarea-ghost hover:textarea-secondary"
                            aria-invalid={errors?.note ? true : undefined}
                            aria-errormessage={
                                errors?.note ? `note-error-${id}` : undefined
                            }
                            placeholder="Add your notes..."
                            value={modifyingNote}
                            onChange={handleChangeModifyingNote}
                        ></textarea>
                        {errors?.note && (
                            <div className="pt-1 text-red-700" id={`note-error-${id}`}>
                                {errors.note}
                            </div>
                        )}
                        {note && note.length > 0 && modifyingNote.length === 0 &&
                            <button
                                type="submit"
                                name="_action"
                                value="remove-note"
                                className="btn btn-xs btn-secondary"
                            >
                                Remove note
                            </button>
                        }
                        {note !== modifyingNote && modifyingNote.length !== 0 &&
                            <button
                                type="submit"
                                name="_action"
                                value="update-note"
                                className="btn btn-xs btn-secondary"
                            >
                                Save note
                            </button>
                        }
                    </Form>
                </div>
            }
        </div>
    );
}

export default function ChallengesListPage() {
    const data = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();

    const errors = actionData && 'errors' in actionData ? actionData.errors as TActionErrorData : null;

    const getAction = ({ completed, revealed }: { completed: boolean, revealed: boolean }) => {
        if (completed) {
            return null
        }
        if (revealed) {
            return { text: "Mark as done", name: "complete" }
        }
        return { text: "Reveal it", name: "reveal" }
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
            {data.challenges.map(challenge =>
                <ChallengeListItem
                    className="mx-2 my-4"
                    key={challenge.id}
                    id={challenge.id}
                    title={`#${challenge.challengeTemplate.position + 1} ${challenge.challengeTemplate.title}`}
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