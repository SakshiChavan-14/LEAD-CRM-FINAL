import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useUploadAvatar } from "../hooks/useUploadAvatar";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

export default function AvatarUploadDialog({ isOpen, onClose, currentAvatar, name }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { mutate: uploadAvatar, isPending } = useUploadAvatar();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = () => {
    if (!selectedFile) return;
    
    uploadAvatar(selectedFile, {
      onSuccess: () => {
        handleClose();
      }
    });
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-upload-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 id="avatar-upload-title" className="text-lg font-semibold text-gray-900">Upload Profile Picture</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
            disabled={isPending}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="mb-6">
            <Avatar 
              src={previewUrl || currentAvatar} 
              name={name} 
              size="2xl" 
              className="border-4 border-gray-50 shadow-sm"
            />
          </div>

          {!selectedFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#7A1F2B]/50 hover:bg-gray-50 transition-colors"
            >
              <ImageIcon className="text-gray-400 mb-2" size={32} />
              <p className="text-sm font-medium text-gray-700">Click to select an image</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG or WEBP (Max 5MB)</p>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-600 truncate mr-3">{selectedFile.name}</span>
              <button 
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="text-xs text-red-600 font-medium hover:underline whitespace-nowrap"
                disabled={isPending}
              >
                Remove
              </button>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/jpeg, image/png, image/webp" 
            onChange={handleFileChange}
          />
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedFile || isPending}
            loading={isPending}
            className="bg-[#7A1F2B] hover:bg-[#6a1b26] text-white flex items-center gap-2"
          >
            <Upload size={16} />
            {isPending ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </div>
    </div>
  );
}
