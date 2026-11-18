import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';

export default function FileDropzone({
  onFileSelect,
  accept = 'image/*',
  label = 'Upload Proof Attachment (Photo or Chart)',
  helperText = 'PNG, JPG, WebP up to 10MB',
  currentUrl = null
}) {
  const [preview, setPreview] = useState(currentUrl);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onFileSelect) onFileSelect(reader.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    if (onFileSelect) onFileSelect(null, null);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-mono uppercase tracking-wider text-dark-300 font-semibold mb-2">
        {label}
      </label>

      {preview ? (
        <div className="relative rounded-xl border border-lime-500/40 bg-dark-900/80 p-2 overflow-hidden group">
          <img
            src={preview}
            alt="Proof preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-dark-950/80 text-white hover:bg-red-500 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="p-2 flex items-center justify-between text-xs font-mono text-lime-400">
            <span className="truncate max-w-[200px]">{fileName || 'Attachment proof loaded'}</span>
            <span className="flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Save
            </span>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-dark-700 hover:border-lime-500/50 rounded-xl bg-dark-950/40 hover:bg-dark-900/60 cursor-pointer transition-all group">
          <div className="w-12 h-12 rounded-full bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400 mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-white group-hover:text-lime-400 transition-colors">
            Click to browse or drop proof file here
          </span>
          <span className="text-xs font-mono text-dark-400 mt-1">
            {helperText}
          </span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
