import { useState } from "react";
import { Library, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Genre } from "@/types";

type GenreManagerProps = {
    genres: Genre[];
    onSave: (name: string) => void;
    onDelete: (id: string) => void;
};

export function GenreManager({ genres, onSave, onDelete }: GenreManagerProps) {
    const [genreName, setGenreName] = useState("");

    const handleSave = () => {
        if (!genreName.trim()) return;
        onSave(genreName);
        setGenreName("");
    };

    return (
        <section className="content-grid">
            <div className="table-panel">
                {genres.map((genre) => (
                    <article className="list-row" key={genre.id}>
                        <strong>{genre.name}</strong>
                        <Button
                            onClick={() => onDelete(genre.id)}
                            size="sm"
                            variant="destructive"
                        >
                            <Trash2 size={14} />
                        </Button>
                    </article>
                ))}
                {!genres.length && (
                    <EmptyState
                        icon={Library}
                        title="No genres"
                        text="Create the first genre to organize the catalog."
                    />
                )}
            </div>
            <aside className="side-panel">
                <h2>Add genre</h2>
                <input
                    value={genreName}
                    onChange={(e) => setGenreName(e.target.value)}
                    placeholder="Genre name"
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <Button onClick={handleSave}>
                    <Plus size={16} />
                    Add genre
                </Button>
            </aside>
        </section>
    );
}

