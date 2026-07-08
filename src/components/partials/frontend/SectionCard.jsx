import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { asset } from '@/lib/helper';

const SectionCard = ({ title, subTitle, imageUrl, link, buttonText }) => {
    return (
        <Card className="group relative mx-auto w-full max-w-sm overflow-hidden pt-0 cursor-pointer">
            <div className="absolute inset-0 z-10 aspect-video bg-black/35 transition-opacity duration-300 group-hover:bg-black/20" />
            <img
                src={imageUrl}
                alt={title}
                className="aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />


            <CardHeader className="relative z-20">
                <CardAction>
                    <Badge variant="secondary">Featured</Badge>
                </CardAction>

                <CardTitle>{title}</CardTitle>

                {subTitle && (
                    <CardDescription>
                        {subTitle}
                    </CardDescription>
                )}
            </CardHeader>

            <CardFooter className="relative z-20">
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">
                        {buttonText}
                    </Button>
                </a>
            </CardFooter>
        </Card>
    );
}

export default SectionCard