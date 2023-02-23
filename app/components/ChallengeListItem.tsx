import clsx from "clsx"

interface IProps {
    title: string
    description: string
    completed: boolean
    revealed: boolean
    action?: {
        text: string
        handler: () => void
    }
    className?: string
};

export default function ChallengeListItem({ title, description, completed, revealed, action, className }: IProps) {
    const isCompletedBadge = completed ? "Done" : null
    const isRevealedBadge = revealed ? "Active" : null
    const isHiddenBadge = "Hidden"

    return (
        <div className={clsx("card card-bordered w-96 bg-base-100 shadow-xl", className)}>
            <div className="card-body">
                <h2 className="card-title">
                    <span className="text-primary">{title}</span>
                    <div className="badge badge-secondary">{isCompletedBadge ?? isRevealedBadge ?? isHiddenBadge}</div>
                </h2>
                <p>{description}</p>
                {action &&
                    <div className="card-actions justify-end">
                        <button className="btn btn-secondary" onClick={action.handler}>{action.text}</button>
                    </div>
                }
            </div>
        </div>
    );
}