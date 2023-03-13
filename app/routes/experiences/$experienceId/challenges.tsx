import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

import { getAdventure } from "~/models/adventure.server";
import { completeChallenge, getNextUnrevealedChallengeListItem, getRevealedChallengeListItems, revealChallenge, updateNote } from "~/models/challenge.server";
import { requireUserId } from "~/session.server";
import { ClockIcon, CurrencyDollarIcon, HomeIcon, ShoppingCartIcon, SunIcon } from '@heroicons/react/24/outline'
import { EHint } from "~/enums";

import defaultCoverImage from "~/assets/adventure_cover.png";
import Modal, { ModalOpener } from "~/components/Modal";
import dayjs from "dayjs";
import { useCountdown } from "~/hooks/useCountdown";
import { getLocalizedCost, getLocalizedDuration, getLocalizedTimeOfDay } from "~/utils/locales";
import type { ETimeOfDayCode, ELanguageCode , ECurrencyCode, EDurationCode} from "~/enums";

export async function loader({ request, params }: LoaderArgs) {
    const userId = await requireUserId(request);
    invariant(params.experienceId, "experienceId not found");

    const adventure = await getAdventure({ userId, id: params.experienceId });
    if (!adventure) {
        throw new Response("Not Found", { status: 404 });
    }

    const revealedChallenges = await getRevealedChallengeListItems({ userId, adventureId: adventure.id });

    const nextUnrevealedChallenge = await getNextUnrevealedChallengeListItem({ userId, adventureId: adventure.id });

    return json({ adventure, revealedChallenges, nextUnrevealedChallenge });
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
                { errors: { _challengeId, note: "Comentário inválido" } },
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

// @TODO - get automatically from action
export type TActionErrorData = { _challengeId: string, note?: string, image?: string };

interface IChallengeListItemProps {
    id: string
    title: string
    description: string
    notePlaceholder: string | null
    cost: string
    time: string
    languageCode: string
    duration: string
    completedAt: string | null
    revealedAt: string | null
    note: string | null
    completedImage: string | null
    hints: string[]
    coverImage: string | null
    errors?: TActionErrorData
    badge?: string
    canOnlyBeRevealedInFuture?: boolean
    className?: string
};

function ChallengeListItem({ id, title, description, notePlaceholder, cost, time, languageCode, duration, completedAt, revealedAt, note, completedImage, hints, coverImage, errors, badge, canOnlyBeRevealedInFuture, className }: IChallengeListItemProps) {
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
                    {getIconComponentByName("currency-dollar", { className: "mr-1" })} {getLocalizedCost(cost as ECurrencyCode, languageCode as ELanguageCode)}
                </span>
                <span className="flex items-center">
                    {getIconComponentByName("sun", { className: "mr-1" })} {getLocalizedTimeOfDay(time as ETimeOfDayCode, languageCode as ELanguageCode)}
                </span>
                <span className="flex items-center">
                    {getIconComponentByName("clock", { className: "mr-1" })} {getLocalizedDuration(duration as EDurationCode, languageCode as ELanguageCode)}
                </span>
            </div>
        )
    }

    const getHintsComponent = (className?: string) => {
        return (
            <div className={clsx("font-semibold lg:w-8", className)}>
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
                        buttonName="Adicionar Foto"
                        className="btn-xs btn-primary"
                    />
                    <Modal
                        id={modalId}
                    >
                        <h2 className="text-xl font-bold mb-2">Foto do Desafio</h2>
                        <p className="my-2">Que tal adicionar a melhor foto do seu desafio?!</p>
                        <p className="my-2">Nota: não é possível alterar posteriormente.</p>
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
                                        Adicionar Foto
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
                        Marcar como Finalizado
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
                    disabled={canOnlyBeRevealedInFuture}
                >
                    Revelar
                </button>
            </Form>
        )
    }

    return (
        <div className={clsx(className)}>
            <div className="flex items-end">
                <div className="flex flex-col items-end">
                    {getInfoComponent("hidden lg:flex justify-center space-x-5 w-96 mb-1")}
                    <div className="indicator">
                        {badge && <span className="indicator-item indicator-start badge badge-primary">{badge}</span>}
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
                                Remover comentário
                            </button>
                        }
                        {note !== modifyingNote && modifyingNote.length !== 0 &&
                            <button
                                type="submit"
                                name="_action"
                                value="update-note"
                                className="btn btn-xs btn-secondary"
                            >
                                Salvar comentário
                            </button>
                        }
                    </Form>
                </div>
            }
        </div>
    );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return {
      title: `${data.adventure.title}`,
    };
  };

export default function ChallengesListPage() {
    const data = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const [daysForReveal, hoursForReveal, minutesForReveal, secondsForReveal] = useCountdown(data.nextUnrevealedChallenge?.canBeRevealedAt ?? dayjs().toISOString());

    const errors = actionData && 'errors' in actionData ? actionData.errors as TActionErrorData : null;

    const getErrorForChallenge = (id: string) => {
        if (!errors) { return }
        const { _challengeId: challengeIdWithErrors } = errors
        if (id === challengeIdWithErrors) {
            return errors
        }
    }

    const canOnlyBeRevealedInFuture = daysForReveal > 0 || hoursForReveal > 0 || minutesForReveal > 0 || secondsForReveal > 0;

    return (
        <div className="flex flex-col justify-center items-center">
            {data.revealedChallenges.map(challenge =>
                <ChallengeListItem
                    className="mx-2 my-4"
                    key={challenge.id}
                    id={challenge.id}
                    title={`#${challenge.position + 1} ${challenge.challengeTemplate.title}`}
                    description={challenge.challengeTemplate.description}
                    notePlaceholder={challenge.challengeTemplate.notePlaceholder}
                    cost={challenge.challengeTemplate.cost}
                    time={challenge.challengeTemplate.timeOfDay}
                    languageCode={challenge.challengeTemplate.languageCode}
                    duration={challenge.challengeTemplate.duration}
                    completedAt={challenge.completedAt}
                    revealedAt={challenge.revealedAt}
                    note={challenge.note}
                    completedImage={challenge.completedImage}
                    hints={challenge.challengeTemplate.hints.map(h => h.hint.name)}
                    coverImage={data.adventure.coverImage}
                    errors={getErrorForChallenge(challenge.id)}
                />
            )}
            {data.nextUnrevealedChallenge &&
                <>
                    {canOnlyBeRevealedInFuture &&
                        <div className="mt-32 w-80 lg:w-[32rem] flex flex-col items-center">
                            <div className="divider">Próximo Desafio em</div>
                            <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
                                <div className="flex flex-col">
                                    <span className="countdown font-mono text-5xl">
                                        <span style={
                                            // @ts-ignore
                                            { "--value": daysForReveal }
                                        }></span>
                                    </span>
                                    dias
                                </div>
                                <div className="flex flex-col">
                                    <span className="countdown font-mono text-5xl">
                                        <span style={
                                            // @ts-ignore
                                            { "--value": hoursForReveal }
                                        }></span>
                                    </span>
                                    horas
                                </div>
                                <div className="flex flex-col">
                                    <span className="countdown font-mono text-5xl">
                                        <span style={
                                            // @ts-ignore
                                            { "--value": minutesForReveal }
                                        }></span>
                                    </span>
                                    min
                                </div>
                                <div className="flex flex-col">
                                    <span className="countdown font-mono text-5xl">
                                        <span style={
                                            // @ts-ignore
                                            { "--value": secondsForReveal }
                                        }></span>
                                    </span>
                                    seg
                                </div>
                            </div>
                        </div>
                    }
                    <ChallengeListItem
                        className="mx-2 my-4 mt-12"
                        id={data.nextUnrevealedChallenge.id}
                        title={`#${data.nextUnrevealedChallenge.position + 1} ${data.nextUnrevealedChallenge.challengeTemplate.title}`}
                        description={data.nextUnrevealedChallenge.challengeTemplate.description}
                        notePlaceholder={data.nextUnrevealedChallenge.challengeTemplate.notePlaceholder}
                        cost={data.nextUnrevealedChallenge.challengeTemplate.cost}
                        time={data.nextUnrevealedChallenge.challengeTemplate.timeOfDay}
                        languageCode={data.nextUnrevealedChallenge.challengeTemplate.languageCode}
                        duration={data.nextUnrevealedChallenge.challengeTemplate.duration}
                        completedAt={data.nextUnrevealedChallenge.completedAt}
                        revealedAt={data.nextUnrevealedChallenge.revealedAt}
                        note={data.nextUnrevealedChallenge.note}
                        completedImage={data.nextUnrevealedChallenge.completedImage}
                        hints={data.nextUnrevealedChallenge.challengeTemplate.hints.map(h => h.hint.name)}
                        coverImage={data.adventure.coverImage}
                        errors={getErrorForChallenge(data.nextUnrevealedChallenge.id)}
                        badge="Novo"
                        canOnlyBeRevealedInFuture={canOnlyBeRevealedInFuture}
                    />
                </>
            }
        </div>
    );
}

export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);

    return <div>An unexpected error occurred: {error.message}</div>;
}
