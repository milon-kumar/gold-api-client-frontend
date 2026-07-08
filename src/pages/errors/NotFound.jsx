import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 text-center sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-6">
                {/* Animated Icon Visual */}
                <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-4 text-muted-foreground animate-bounce">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                    <h1 className="text-7xl font-extrabold tracking-tighter text-foreground sm:text-8xl">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Page not found
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>

                    <Button
                        asChild
                        className="w-full sm:w-auto"
                    >
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
