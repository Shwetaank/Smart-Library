import { useState } from "react";
import { Library, Plus, Trash2 } from "lucide-react";

import type { Genre } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";

interface GenreManagerProps {
  genres: Genre[];
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
}

export function GenreManager({ genres, onSave, onDelete }: GenreManagerProps) {
  const [genreName, setGenreName] = useState("");

  const handleSave = () => {
    if (!genreName.trim()) return;
    onSave(genreName);
    setGenreName("");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Genre list */}
      <div className="space-y-3 lg:col-span-2">
        {genres.map((genre) => (
          <Card key={genre.id} className="transition-all hover:shadow-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Library size={14} className="text-primary" />
                </div>
                <span className="text-sm font-medium">{genre.name}</span>
              </div>
              <Button
                onClick={() => onDelete(genre.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 dark:hover:bg-red-950/50"
              >
                <Trash2 size={14} />
              </Button>
            </CardContent>
          </Card>
        ))}

        {!genres.length && (
          <EmptyState
            icon={Library}
            title="No genres"
            text="Create the first genre to organize the catalog."
          />
        )}
      </div>

      {/* Add genre */}
      <Card className="sticky top-24 h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add genre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={genreName}
            onChange={(e) => setGenreName(e.target.value)}
            placeholder="Genre name"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <Button onClick={handleSave} className="w-full">
            <Plus size={14} />
            Add genre
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}