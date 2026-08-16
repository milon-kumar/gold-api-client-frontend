import React, { useRef, useState } from 'react';
import { FileText, FileSpreadsheet, FileType2, File as FileIcon, Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ALLOWED_DOCUMENT_TYPES } from '@/hooks/use-document-upload';

const getFileMeta = (fileName = '', fileType = '') => {
    const ext = (fileName?.split('.').pop() || '').toLowerCase();

    if (ext === 'pdf' || fileType === 'application/pdf') {
        return { icon: FileText, bg: 'bg-red-100', color: 'text-red-600' };
    }
    if (['doc', 'docx'].includes(ext)) {
        return { icon: FileType2, bg: 'bg-blue-100', color: 'text-blue-600' };
    }
    if (['xls', 'xlsx'].includes(ext)) {
        return { icon: FileSpreadsheet, bg: 'bg-green-100', color: 'text-green-600' };
    }
    if (['ppt', 'pptx'].includes(ext)) {
        return { icon: FileType2, bg: 'bg-orange-100', color: 'text-orange-600' };
    }
    return { icon: FileIcon, bg: 'bg-gray-100', color: 'text-gray-600' };
};

export const DocumentFileUploader = ({
    fileUrl,
    fileName,
    fileType,
    error,
    onFileChange,
    onRemove,
    maxSizeMB = 10,
    allowedTypes = ALLOWED_DOCUMENT_TYPES,
    label = 'Document File',
}) => {
    const inputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const acceptAttr = Object.keys(allowedTypes).join(',');
    const allowedLabels = Object.values(allowedTypes).map((t) => t.label).join(', ');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) onFileChange(droppedFile);
    };

    const handleInputChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) onFileChange(selected);
        e.target.value = '';
    };

    const hasFile = Boolean(fileUrl);
    const { icon: Icon, bg, color } = getFileMeta(fileName, fileType);

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}

            {hasFile ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-md shrink-0 ${bg} ${color}`}>
                            <Icon size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                                {fileName || 'File'}
                            </p>
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Preview / Download
                            </a>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="shrink-0 rounded-full p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${dragActive
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                        }`}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <Upload size={18} />
                    </div>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Choose a file</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                        {allowedLabels} — Max {maxSizeMB}MB
                    </p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={acceptAttr}
                className="hidden"
                onChange={handleInputChange}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};
