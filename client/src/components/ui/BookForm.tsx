
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    // Book form panel
    <aside className="side-panel">
      <h2>{bookForm.id ? "Edit book" : "Add book"}</h2>

      {/* Book details */}
      <input
        value={bookForm.title}
        onChange={(e) => onFieldChange({ title: e.target.value })}
        placeholder="Title"
      />

      <input
        value={bookForm.author}
        onChange={(e) => onFieldChange({ author: e.target.value })}
        placeholder="Author"
      />

      <input
        value={bookForm.isbn}
        onChange={(e) => onFieldChange({ isbn: e.target.value })}
        placeholder="ISBN"
      />

      <select
        value={bookForm.genreId}
        onChange={(e) => onFieldChange({ genreId: e.target.value })}
      >
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <input
        value={bookForm.publishedYear}
        onChange={(e) => onFieldChange({ publishedYear: e.target.value })}
        placeholder="Published year"
        type="number"
      />

      <input
        value={bookForm.quantity}
        onChange={(e) => onFieldChange({ quantity: e.target.value })}
        placeholder="Quantity"
        type="number"
      />

      <input
        value={bookForm.coverUrl}
        onChange={(e) => onFieldChange({ coverUrl: e.target.value })}
        placeholder="Cover image URL"
      />

      {/* Cover upload */}
      <label className="file-control">
        <Upload size={16} />
        <span>{coverUploading ? "Uploading..." : "Upload cover"}</span>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={coverUploading}
          onChange={(e) => onUploadCover(e.target.files?.[0])}
        />
      </label>

      {/* Cover preview */}
      {bookForm.coverUrl && (
        <div className="cover-preview">
          <img src={bookForm.coverUrl} alt="Selected book cover" />
        </div>
      )}

      {/* Book description */}
      <textarea
        value={bookForm.description}
        onChange={(e) => onFieldChange({ description: e.target.value })}
        placeholder="Description"
      />

      {/* Form actions */}
      <Button onClick={onSave}>
        <Plus size={16} />
        {bookForm.id ? "Save book" : "Add book"}
      </Button>

      {bookForm.id && (
        <Button onClick={onCancelEdit} variant="outline">
          <X size={16} />
          Cancel edit
        </Button>
      )}
    </aside>
  );
};
