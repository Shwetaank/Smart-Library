import { Check, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AppContext";

export function ProfilePanel() {
  const {
    auth: { profileName, setProfileName },
    handlers: { handleSaveProfile },
  } = useAppContext();

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
          <label className="text-xs font-medium text-muted-foreground">Display name</label>
          <Input
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <Button onClick={handleSaveProfile} variant="outline" className="shrink-0">
          <Check size={14} />
          Save profile
        </Button>
      </CardContent>
    </Card>
  );
}

