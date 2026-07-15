import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface TaskNoteModalProps {
  open: boolean;
  taskTitle: string;
  initialNote: string;
  saving?: boolean;
  onCancel: () => void;
  onSave: (note: string) => void;
}

/**
 * Small modal for the optional note captured when a task is marked
 * completed, skipped, or declined. Replaces window.prompt() so the note
 * entry fits the app's own styling and works on mobile.
 */
export function TaskNoteModal({
  open,
  taskTitle,
  initialNote,
  saving = false,
  onCancel,
  onSave,
}: TaskNoteModalProps) {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    if (open) setNote(initialNote);
  }, [open, initialNote]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add a note</h2>
            <p className="text-sm text-slate-500 mt-1">{taskTitle}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-smooth"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            autoFocus
            placeholder="Anything worth recording about this task..."
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-smooth resize-none"
          />
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={() => onSave(note)} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
