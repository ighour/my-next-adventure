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
                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    <div className="space-y-2">
                        <h4 className="text-md space-x-2">
                            <span className="underline">Adventure Code:</span>
                            <span>{inviteId}</span>
                        </h4>
                        <h4 className="text-md space-x-2">
                            <span className="underline">Max adventurers:</span>
                            <span>{maxJoiners === null ? "Unlimited" : maxJoiners + 1}</span>
                        </h4>
                        <div>
                            <h4 className="text-md underline">Adventurers:</h4>
                            <ul>
                                <li>{creator} (owner)</li>
                                {joiners.map(joiner =>
                                    <li key={joiner}>{joiner}</li>
                                )
                                }
                            </ul>
                        </div>
                    </div>
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