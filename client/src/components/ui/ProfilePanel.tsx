import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProfilePanelProps = Readonly<{
  name: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
}>;

export function ProfilePanel({
  name,
  onNameChange,
  onSave,
}: ProfilePanelProps) {
  return (
    // Profile settings
    <section className="profile-panel">
      <h2>Profile</h2>

      {/* Profile name */}
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Your name"
      />

      {/* Save profile */}
      <Button onClick={onSave} variant="outline">
        <Check size={16} />
        Save profile
      </Button>
    </section>
  );
}