import { toast } from "react-toastify";

export const toastNotification = (message: string, type: 'info' | 'error' = 'info') => {
    toast(message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        type: type,
    });
};