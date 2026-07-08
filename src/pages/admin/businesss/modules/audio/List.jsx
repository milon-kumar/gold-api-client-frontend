import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Construction } from "lucide-react";

export default function Upcoming() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-muted/60 shadow-sm">
                <CardContent className="flex flex-col items-center p-8 text-center space-y-6">

                    {/* Minimal Icon Indicator */}
                    <div className="rounded-full bg-muted p-3.5 text-muted-foreground">
                        <Construction className="h-6 w-6 text-primary" />
                    </div>

                    {/* Clean Typography */}
                    <div className="space-y-2">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            Coming Soon
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                            We are currently building this feature. Check back soon for updates!
                        </p>
                    </div>

                    {/* Simple Go Back Action */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto h-9 px-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}
