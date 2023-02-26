import { Form } from "@remix-run/react"
import clsx from "clsx"
import type { ChangeEvent, ChangeEventHandler} from "react";
import React, { useState } from "react"
import type { TActionErrorData } from "~/routes/adventures2/$adventureId"

interface IProps {
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
    index: number
    errors?: TActionErrorData
    className?: string
};

export default function ChallengeListItem({ id, title, description, notePlaceholder, completed, revealed, note, action, errors, className }: IProps) {
    const [modifyingNote, setModifyingNote] = useState(note ?? "");

    const noteRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (errors?.note) {
            noteRef.current?.focus();
        }
    }, [errors]);

    const handleChangeModifyingNote = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setModifyingNote(() => event.target.value );
    }

    return (
        <div className={clsx(className)}>
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