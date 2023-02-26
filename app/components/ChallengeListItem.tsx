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

export default function ChallengeListItem({ id, title, description, completed, revealed, note, action, className }: IProps) {
    return (
        <div className={clsx("card lg:card-side bg-base-100 shadow-xl", className)}>
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
                                className="btn btn-secondary"
                            >
                                {action.text}
                            </button>
                        </Form>
                    </div>
                }
            </div>
        </div>
    );
}