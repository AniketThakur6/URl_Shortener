import { AlertTriangle, Trash, X } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-link-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-red-500/15 p-3 text-red-400">
              <AlertTriangle size={24} />
            </span>
            <div>
              <h2 id="delete-link-title" className="text-xl font-semibold text-white">
                Delete this link?
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            aria-label="Cancel delete"
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-zinc-700 px-4 py-2 text-white hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <Trash size={18} /> Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
