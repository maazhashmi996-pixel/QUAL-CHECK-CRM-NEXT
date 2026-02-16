"use client";
import { useState, ChangeEvent } from 'react';

interface FileUploadProps {
    onUploadSuccess: (url: string) => void;
    label: string;
}

export default function FileUpload({ onUploadSuccess, label }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );
            const data = await res.json();
            onUploadSuccess(data.secure_url);
            alert(`${label} uploaded successfully!`);
        } catch (err) {
            alert("Upload failed!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <span className="text-xs text-blue-500 animate-pulse">Uploading...</span>}
        </div>
    );
}