import { Check, UserRound } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProfilePanelProps {
  name: string;
  onNameChange: Dispatch<SetStateAction<string>>;
  onSave: () => void;
}

export function ProfilePanel({
  name,
  onNameChange,
  onSave,
}: ProfilePanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <UserRound size={18} className="text-primary" />
          <CardTitle className="text-base">Profile Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Display name
          </label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <Button onClick={onSave} variant="outline" className="shrink-0">
          <Check size={14} />
          Save profile
        </Button>
      </CardContent>
    </Card>
  );
}