import { Toaster } from 'react-hot-toast';

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
                // className: 'bg-primary',
                duration: 5000,
            }}
        />

    );
}
