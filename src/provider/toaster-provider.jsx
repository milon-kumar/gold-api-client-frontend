import { Toaster as SonnerToaster } from "sonner";
import {useTheme} from "next-themes";

export default function Toaster() {
    const { theme } = useTheme();

    return (
        <SonnerToaster
            theme={theme ? "dark" : "light"}
            toastOptions={{
                style: {
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                },
                descriptionClassName: "text-[12px]",
                actionButtonStyle: {
                    background: "var(--color-accent)",
                    color: "#fff",
                },
            }}
        />
    );
}
