import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showToast(message: string, className: string, duration = 3000) {
    const options = {
        text: message,
        duration: duration,
        close: true,
        gravity: "top", 
        position: "center",
        stopOnFocus: true,
        className: `custom-toast ${className}`,
    };
    
    Toastify(options).showToast();
}