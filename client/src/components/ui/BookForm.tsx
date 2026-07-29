import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { BookForm as BookFormType, Genre } from "@/types";

type BookFormProps = {
  bookForm: BookFormType;
  genres: Genre[];
  coverUploading: boolean;
  onFieldChange: (field: Partial<BookFormType>) => void;
  onUploadCover: (file?: File) => void;
  onSave: () => void;
  onCancelEdit: () => void;
};

export const BookFormPanel = ({
  bookForm,
  genres,
  coverUploading,
  onFieldChange,
  onUploadCover,
  onSave,
  onCancelEdit,
}: BookFormProps) => {
  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {bookForm.id ? "Edit book" : "Add book"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={bookForm.title}
          onChange={(e) => onFieldChange({ title: e.target.value })}
          placeholder="Title"
        />
        <Input
          value={bookForm.author}
          onChange={(e) => onFieldChange({ author: e.target.value })}
          placeholder="Author"
        />
        <Input
          value={bookForm.isbn}
          onChange={(e) => onFieldChange({ isbn: e.target.value })}
          placeholder="ISBN"
        />
        <select
          value={bookForm.genreId}
          onChange={(e) => onFieldChange({ genreId: e.target.value })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <Input
          value={bookForm.publishedYear}
          onChange={(e) => onFieldChange({ publishedYear: e.target.value })}
          placeholder="Published year"
          type="number"
        />
        <Input
          value={bookForm.quantity}
          onChange={(e) => onFieldChange({ quantity: e.target.value })}
          placeholder="Quantity"
          type="number"
        />
        <Input
          value={bookForm.coverUrl}
          onChange={(e) => onFieldChange({ coverUrl: e.target.value })}
          placeholder="Cover image URL"
        />

        {/* Cover upload */}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
          <Upload size={14} />
          <span>{coverUploading ? "Uploading..." : "Upload cover"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={coverUploading}
            className="hidden"
            onChange={(e) => onUploadCover(e.target.files?.[0])}
          />
        </label>

        {/* Cover preview */}
        {bookForm.coverUrl && (
          <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-2">
            <div className="h-12 w-9 shrink-0 overflow-hidden rounded border bg-muted">
              <img src={bookForm.coverUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <span className="truncate text-xs text-muted-foreground">Cover preview</span>
          </div>
        )}

        <textarea
          value={bookForm.description}
          onChange={(e) => onFieldChange({ description: e.target.value })}
          placeholder="Description"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-y"
        />

        <Button onClick={onSave} className="w-full">
          <Plus size={14} />
          {bookForm.id ? "Save book" : "Add book"}
        </Button>

        {bookForm.id && (
          <Button onClick={onCancelEdit} variant="outline" className="w-full">
            <X size={14} />
            Cancel edit
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

