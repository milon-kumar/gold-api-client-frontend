import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search,Video,Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const VideoInformationCard = ({
    meta = {},
    onChange,
}) => {
    const getYouTubeVideoId = (url) => {
        if (!url) return null;

        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }

        return null;
    };
    const videoId = getYouTubeVideoId(meta.url);

    return (
        <Card className="shadow-sm">
            <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Search className="h-5 w-5 text-purple-600" />
                    Add your video url
                </CardTitle>
                <CardDescription>Given video url form youtube</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div>
                    <Label htmlFor="video_url" className="text-sm font-semibold">
                        YouTube URL <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                        <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="video_url"
                            value={meta.url}
                            onChange={(e) => onChange('url', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="pl-9"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                        Enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=g7ZjMy71aEY)
                    </p>

                    {/* Video Preview */}
                    {videoId && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <Video className="h-4 w-4 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-700">
                                        Video detected
                                    </p>
                                    <p className="text-xs text-blue-600">
                                        Video ID: {videoId}
                                    </p>
                                </div>
                                <Badge className="bg-green-100 text-green-800 border-0">
                                    Valid
                                </Badge>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

    )
}

export default VideoInformationCard


