import { Form } from "@remix-run/react"
import clsx from "clsx"

interface IProps {
    id: string
    title: string
    description: string
    completed: boolean
    revealed: boolean
    note: string | null
    action: {
        text: string
        name: string
    } | null
    index: number
    className?: string
};

function ChallengeListItemTemplate({ title, description, revealed }: Pick<IProps, "title" | "description" | "revealed">) {
    return (
        <div className="card card-bordered w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">
                    <span className="text-primary">{title}</span>
                </h2>
                <div className={clsx("space-y-4 my-2", `${!revealed ? "blur-sm" : ""}`)} dangerouslySetInnerHTML={{ __html: description }} />
            </div>
        </div>
    );
}

function ChallengeListItemResult({ id, completed, note, action }: Pick<IProps, "id" | "completed" | "note" | "action">) {
    return (
        <div className="card w-96 bg-base-300">
            <div className="card-body flex items-center justify-center">
                {completed && note &&
                    <div>
                        <p className="text-center underline mb-4">Notes</p>
                        <div dangerouslySetInnerHTML={{ __html: note }} />
                    </div>
                }
                {action &&
                    <Form method="post">
                        <input type="hidden" name="_challengeId" value={id} />
                        <div className="card-actions justify-end">
                            <button
                                type="submit"
                                name="_action"
                                value={action.name}
                                className="btn btn-secondary"
                            >
                                {action.text}
                            </button>
                        </div>
                    </Form>
                }
            </div>
        </div>
    );
}

export default function ChallengeListItem({ id, title, description, completed, revealed, note, action, index, className }: IProps) {
    const showTemplateThenResult = index % 2 === 0 ? true : false

    const templateComponent = <ChallengeListItemTemplate
        title={title}
        description={description}
        revealed={revealed}
    />

    const resultComponent = <ChallengeListItemResult
        id={id}
        completed={completed}
        note={note}
        action={action}
    />

    return (
        <div className={clsx("flex", className)}>
            {showTemplateThenResult && 
                <>
                    {templateComponent}
                    {resultComponent}
                </>
            }
            {!showTemplateThenResult && 
                <>
                    {resultComponent}
                    {templateComponent}
                </>
            }
        </div>
    );
}