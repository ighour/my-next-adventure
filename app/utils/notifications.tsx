import toast from "react-hot-toast";

export function createNotificationWithTitleAndDescription({ title, description }: { title: string, description: string }) {
    toast.custom(
        <div className="alert shadow-lg">
            <div>
                <div>
                    <h3 className="font-bold">{title}</h3>
                    <div className="text-xs">{description}</div>
                </div>
            </div>
        </div>
    );
}