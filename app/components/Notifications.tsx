import toast, { Toaster } from 'react-hot-toast';

export default function Notifications() {
    return (
        <Toaster
            position="bottom-right"
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
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> */}
                <div>
                    <h3 className="font-bold">{title}</h3>
                    <div className="text-xs">{description}</div>
                </div>
            </div>
            {/* <div className="flex-none">
                <button className="btn btn-sm">See</button>
            </div> */}
        </div>
    );
}