import { useState, useCallback } from 'react';

// List all the formats you want to allow here
export const ALLOWED_DOCUMENT_TYPES = {
    'application/pdf': { label: 'PDF', ext: 'pdf' },
    'application/msword': { label: 'DOC', ext: 'doc' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'DOCX', ext: 'docx' },
    'application/vnd.ms-excel': { label: 'XLS', ext: 'xls' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { label: 'XLSX', ext: 'xlsx' },
    'application/vnd.ms-powerpoint': { label: 'PPT', ext: 'ppt' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { label: 'PPTX', ext: 'pptx' },
    'text/plain': { label: 'TXT', ext: 'txt' },
    'application/zip': { label: 'ZIP', ext: 'zip' },
};

const useDocumentUpload = (maxSizeMB = 10, allowedTypes = ALLOWED_DOCUMENT_TYPES) => {
    const [file, setFile] = useState(null);       // base64 string
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState(''); // mime type
    const [error, setError] = useState('');

    const handleFileChange = useCallback((selectedFile) => {
        setError('');
        if (!selectedFile) return;

        if (!allowedTypes[selectedFile.type]) {
            const allowedLabels = Object.values(allowedTypes).map((t) => t.label).join(', ');
            setError(`Only the following formats can be uploaded: ${allowedLabels}`);
            return;
        }

        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (selectedFile.size > maxSizeBytes) {
            setError(`File size cannot exceed ${maxSizeMB}MB`);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setFile(reader.result);
            setFileName(selectedFile.name);
            setFileType(selectedFile.type);
        };
        reader.onerror = () => setError('Failed to read file');
        reader.readAsDataURL(selectedFile);
    }, [maxSizeMB, allowedTypes]);

    const resetFile = useCallback(() => {
        setFile(null);
        setFileName('');
        setFileType('');
        setError('');
    }, []);

    // For setting existing file URL in edit mode
    const setFileUrl = useCallback(({ file: fileUrl, name, type }) => {
        setFile(fileUrl || null);
        setFileName(name || '');
        setFileType(type || '');
    }, []);

    return { file, fileName, fileType, error, handleFileChange, resetFile, setFileUrl };
};

export default useDocumentUpload;