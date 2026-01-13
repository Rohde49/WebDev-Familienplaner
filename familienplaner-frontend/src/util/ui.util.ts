import { toast } from "sonner";

export const uiToast = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast(message),
};