import toast, { Toaster } from 'react-hot-toast';

export default function Notifications() {
    return (
        <Toaster
            position="bottom-left"
            reverseOrder={false}
            gutter={8}
            containerClassName="max-w-xl"
            containerStyle={{}}
            toastOptions={{
                // Define default options
                className: '',
                duration: 5000,
                style: {
                    background: '#363636',
                    color: '#fff',
                },
            }}
        />

    );
}

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