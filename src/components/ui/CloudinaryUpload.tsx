import React, { useRef, useState } from 'react';
import { CloudUpload, Loader2, ImageIcon } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const CLOUDINARY_ENABLED = Boolean(CLOUD_NAME && UPLOAD_PRESET);

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  hint?: string;
  className?: string;
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onUpload,
  label = 'Upload image',
  hint,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToastStore();

  if (!CLOUD_NAME || !UPLOAD_PRESET) return null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, WEBP...).');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Image must be under 10 MB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      onUpload(data.secure_url || data.url);
      addToast('Image Uploaded! 🖼️', 'Your image is live on Cloudinary.', 'success');
    } catch (err: any) {
      setError(err.message || 'Upload failed. Check your Cloudinary config.');
      addToast('Upload Failed', err.message || 'Could not upload image.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-violet-600/20 active:scale-95 transition-all"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <CloudUpload className="w-4 h-4" />
            {label}
          </>
        )}
      </button>
      {hint && (
        <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-1.5">
          <ImageIcon className="w-3 h-3" />
          {hint}
        </p>
      )}
      {error && <p className="text-[11px] text-rose-500 font-semibold mt-1.5">{error}</p>}
    </div>
  );
};
