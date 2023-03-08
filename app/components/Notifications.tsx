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
