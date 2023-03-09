import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

import { getAdventure } from "~/models/adventure.server";
import { completeChallenge, getChallengeListItems, revealChallenge, updateNote } from "~/models/challenge.server";
import { requireUserId } from "~/session.server";
import { ClockIcon, CurrencyDollarIcon, HomeIcon, ShoppingCartIcon, SunIcon } from '@heroicons/react/24/outline'
import { EHint } from "~/models/enums";

import defaultCoverImage from "~/assets/adventure_cover.png";
import Modal, { ModalOpener } from "~/components/Modal";

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

function getIconComponentByName(name: string, props?: { className?: string, key?: string }) {
    switch (name) {
        case "currency-dollar":
            return <CurrencyDollarIcon className={clsx("h-8 w-8", props?.className)} key={props?.key} />
        case "sun":
            return <SunIcon className={clsx("h-8 w-8", props?.className)} key={props?.key} />
        case "clock":
            return <ClockIcon className={clsx("h-8 w-8", props?.className)} key={props?.key} />
        case "home":
        case EHint.HOME:
            return <HomeIcon className={clsx("h-8 w-8", props?.className)} key={props?.key} />
        case "shopping-cart":
        case EHint.SHOPPING_CART:
            return <ShoppingCartIcon className={clsx("h-8 w-8", props?.className)} key={props?.key} />
        default: return <span key={props?.key}></span>
    }
}

function getFormattedCost(cost: string) {
    let numericCost = Number(cost);

    if (numericCost <= 0) {
        return "FREE";
    }
    if (numericCost < 1) {
        return "1";
    }
    if (numericCost < 10) {
        return "10";
    }
    if (numericCost < 20) {
        return "20";
    }
    if (numericCost < 30) {
        return "30";
    }
    if (numericCost <= 50) {
        return "50";
    }
    return "> 50";
}

function getFormattedDuration(duration: number) {
    if (duration <= 1) {
        return "1M";
    }
    if (duration <= 5) {
        return "5M";
    }
    if (duration <= 10) {
        return "10M";
    }
    if (duration <= 15) {
        return "15M";
    }
    if (duration <= 30) {
        return "30M";
    }
    if (duration <= 45) {
        return "45M";
    }
    if (duration <= 60) {
        return "1H";
    }
    if (duration <= 90) {
        return "1H30M";
    }
    if (duration <= 120) {
        return "2H";
    }
    if (duration <= 180) {
        return "3H";
    }
    if (duration <= 240) {
        return "4H";
    }
    if (duration <= 300) {
        return "5H";
    }
    return "> 5H";
}

// @TODO - get automatically from action
export type TActionErrorData = { _challengeId: string, note?: string, image?: string };

interface IChallengeListItemProps {
    id: string
    title: string
    description: string
    notePlaceholder: string | null
    cost: string
    time: string
    duration: number
    completedAt: string | null
    revealedAt: string | null
    note: string | null
    completedImage: string | null
    hints: string[]
    coverImage: string | null
    errors?: TActionErrorData
    className?: string
};

function ChallengeListItem({ id, title, description, notePlaceholder, cost, time, duration, completedAt, revealedAt, note, completedImage, hints, coverImage, errors, className }: IChallengeListItemProps) {
    const [modifyingNote, setModifyingNote] = useState(note ?? "");
    const imageUploadsFetcher = useFetcher();

    const noteRef = useRef<HTMLTextAreaElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (errors?.note) {
            noteRef.current?.focus();
        }
        if (errors?.image) {
            imageRef.current?.focus();
        }
    }, [errors]);

    const handleChangeModifyingNote = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setModifyingNote(() => event.target.value);
    }

    const getInfoComponent = (className?: string) => {
        return (
            <div className={clsx("font-semibold", className)}>
                <span className="flex items-center">
                    {getIconComponentByName("currency-dollar", { className: "mr-1" })} {getFormattedCost(cost)}
                </span>
                <span className="flex items-center">
                    {getIconComponentByName("sun", { className: "mr-1" })} {time}
                </span>
                <span className="flex items-center">
                    {getIconComponentByName("clock", { className: "mr-1" })} {getFormattedDuration(duration)}
                </span>
            </div>
        )
    }

    const getHintsComponent = (className?: string) => {
        return (
            <div className={clsx("font-semibold", className)}>
                {hints.map(hint => getIconComponentByName(hint, { key: hint }))}
            </div>
        )
    }

    const getActionsFormComponent = () => {
        if (completedAt) {
            // @TODO - cant replace for now
            if (completedImage) {
                return null
            }

            const modalId = `challenge-image-upload-${id}`;

            return (
                <>
                    <ModalOpener
                        id={modalId}
                        buttonName="Add Picture"
                        className="btn-xs btn-primary"
                    />
                    <Modal
                        id={modalId}
                    >
                        <h2 className="text-xl font-bold mb-2">Challenge Picture</h2>
                        <p className="my-2">Let's upload the best picture you took for this challenge!</p>
                        <p className="my-2">Note: you can't change it later</p>
                        <div className="mt-2">
                            <imageUploadsFetcher.Form method="post" action="/uploads" encType="multipart/form-data">
                                <input type="hidden" name="_challengeId" value={id} />
                                <input
                                    ref={imageRef}
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    required={true}
                                    aria-invalid={errors?.image ? true : undefined}
                                    aria-errormessage={
                                        errors?.image ? `image-error-${id}` : undefined
                                    }
                                    className="file-input file-input-bordered file-input-md w-full max-w-xs"
                                />
                                {errors?.image && (
                                    <div className="pt-1 text-red-700" id={`image-error-${id}`}>
                                        {errors.image}
                                    </div>
                                )}
                                <div className="mt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-xs btn-primary"
                                    >
                                        Add picture
                                    </button>
                                </div>
                            </imageUploadsFetcher.Form>
                        </div>
                    </Modal>
                </>
            )
        }
        if (revealedAt) {
            return (
                <Form method="post">
                    <input type="hidden" name="_challengeId" value={id} />
                    <button
                        type="submit"
                        name="_action"
                        value="complete"
                        className="btn btn-xs btn-primary"
                    >
                        Mark as done
                    </button>
                </Form>
            )
        }

        return (
            <Form method="post">
                <input type="hidden" name="_challengeId" value={id} />
                <button
                    type="submit"
                    name="_action"
                    value="reveal"
                    className="btn btn-xs btn-primary"
                >
                    Reveal it
                </button>
            </Form>
        )
    }

    return (
        <div className={clsx(className)}>
            <div className="flex items-end">
                <div className="flex flex-col items-end">
                    {getInfoComponent("hidden lg:flex justify-center space-x-5 w-96 mb-1")}
                    <div className="card lg:card-side bg-base-100 shadow-xl">
                        <figure className="w-96">
                            <img
                                src={completedImage ?? coverImage ?? defaultCoverImage}
                                alt="Adventure cover"
                            />
                        </figure>
                        <div className="card-body w-96 lg:h-96">
                            <h2 className="card-title px-2">{title}</h2>
                            <div className={clsx("space-y-4 h-64 overflow-y-auto px-1", `${!revealedAt ? "blur-sm" : ""}`)} dangerouslySetInnerHTML={{ __html: description }} />
                            <div className="lg:hidden space-y-2 py-2">
                                {getInfoComponent("flex justify-center space-x-5")}
                                {getHintsComponent("flex justify-center space-x-5")}
                            </div>
                            <div className="card-actions justify-end pt-2 flex justify-center lg:justify-end">
                                {getActionsFormComponent()}
                            </div>
                        </div>
                    </div>
                </div>
                {getHintsComponent("hidden lg:flex flex-col items-start space-y-5 h-96 ml-2")}
            </div>
            {completedAt &&
                <div className="form-control my-2 px-3">
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
                    title={`#${challenge.position + 1} ${challenge.challengeTemplate.title}`}
                    description={challenge.challengeTemplate.description}
                    notePlaceholder={challenge.challengeTemplate.notePlaceholder}
                    cost={challenge.challengeTemplate.costEuros}
                    time={challenge.challengeTemplate.timeOfDay}
                    duration={challenge.challengeTemplate.durationMinutes}
                    completedAt={challenge.completedAt}
                    revealedAt={challenge.revealedAt}
                    note={challenge.note}
                    completedImage={challenge.completedImage}
                    hints={challenge.challengeTemplate.hints.map(h => h.hint.name)}
                    coverImage={data.adventure.coverImage}
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
