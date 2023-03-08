import clsx from "clsx";
import type { ReactNode } from "react";

const MODAL_ID = "my-challenge-image-upload"

interface IProps {
    id: string
    children: ReactNode
}

export default function ChallengeImageUploadModal({ id, children }: IProps) {
    return (
        <>
            <input type="checkbox" id={`${MODAL_ID}-${id}`} className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box relative">
                    <label htmlFor={`${MODAL_ID}-${id}`} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    <h2 className="text-xl font-bold mb-2">Challenge Picture</h2>
                    <p className="my-2">Let's upload the best picture you took for this challenge!</p>
                    <p className="my-2">Note: you can't change it later</p>
                    <div className="mt-2">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

export function ChallengeImageUploadModalOpener({ id, className }: { id: string, className?: string }) {
    return (
        <label htmlFor={`${MODAL_ID}-${id}`} className={clsx("btn btn-xs btn-primary", className)}>Add Picture</label>
    )
}