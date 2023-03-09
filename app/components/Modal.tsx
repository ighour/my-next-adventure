import clsx from "clsx";
import type { ReactNode } from "react";

interface IProps {
    id: string
    children: ReactNode
}

export default function Modal({ id, children }: IProps) {
    const modalId = `modal-${id}`;
    return (
        <>
            <input type="checkbox" id={modalId} className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box relative">
                    <label htmlFor={modalId} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    {children}
                </div>
            </div>
        </>
    );
}

export function ModalOpener({ id, buttonName, className }: { id: string, buttonName: string, className?: string }) {
    const modalId = `modal-${id}`;
    return (
        <label htmlFor={modalId} className={clsx("btn", className)}>{buttonName}</label>
    )
}