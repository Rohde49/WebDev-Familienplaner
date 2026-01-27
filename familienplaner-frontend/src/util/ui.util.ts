import { toast } from "sonner";
import { clsx } from "clsx";

export const uiToast = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast(message),
};

export function cn(...classes: (string | undefined | false)[]) {
    return clsx(classes);
}