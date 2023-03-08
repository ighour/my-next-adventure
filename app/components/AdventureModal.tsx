import clsx from "clsx";

const MODAL_ID = "my-adventure-modal"

interface IProps {
    title: string
    inviteId: string
    maxJoiners: number | null
    creator: string
    joiners: string[]
}

export default function AdventureModal({ title, inviteId, maxJoiners, creator, joiners }: IProps) {
    return (
        <>
            <input type="checkbox" id={MODAL_ID} className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box relative">
                    <label htmlFor={MODAL_ID} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    <h2 className="text-xl font-bold mb-2">{title}</h2>
                    <ul className="space-y-2 text-md">
                        <li>
                            1. You can invite other people to your adventure by using the code <span className="underline font-semibold">{inviteId}</span>
                        </li>
                        {maxJoiners !== null &&
                            <li>
                                2. This adventure is limited to <span className="underline font-semibold">{maxJoiners + 1}</span> people
                            </li>
                        }
                        {maxJoiners === null &&
                            <li>
                                2. You can invite <span className="underline font-semibold">unlimited</span> people for this adventure
                            </li>
                        }
                        <li>
                            3. Adventure creator is <span className="underline font-semibold">{creator}</span>
                        </li>
                    </ul>
                    {joiners.length > 0 &&
                        <>
                            <div className="mt-2">4. Other adventurers are:</div>
                            <ul className="space-y-2 text-md">
                                {joiners.map(joiner =>
                                    <li key={joiner}>
                                        - {joiner}
                                    </li>
                                )}
                            </ul>
                        </>
                    }
                </div>
            </div>
        </>
    );
}

export function AdventureModalOpener({ className }: { className?: string }) {
    return (
        <label htmlFor={MODAL_ID} className={clsx("btn btn-secondary", className)}>Info</label>
    )
}