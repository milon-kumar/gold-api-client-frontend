import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Star } from "lucide-react";
import StatusBadge from "@/components/shear/StatusBadge";

const StatusSettingsCard = ({ isFeatured, status, onFeaturedChange, onStatusChange }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings className="h-5 w-5 text-orange-600" />
          Status & Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">Featured</span>
            </div>
            <p className="text-xs text-muted-foreground">Mark this item as featured</p>
          </div>
          <Switch checked={isFeatured} onCheckedChange={onFeaturedChange} />
        </div>

        <Separator />

        <div>
          <Label htmlFor="status" className="text-sm font-semibold">Status</Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-2">
            <StatusBadge status={status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSettingsCard;