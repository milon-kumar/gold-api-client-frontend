import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import { DocumentFileUploader } from '@/components/ui/document-file-uploader';
import useDocumentUpload from '@/hooks/use-document-upload';

const defaultButtons = [
  { key: 'details', title: 'Details', url: '/details/:id', is_default: true },
];

const bookDefaultButtons = [
  { key: 'details', title: 'Details', url: '/details/:id', is_default: true },
  { key: 'buy', title: 'Buy Now', url: '', is_default: true },
];

const emptyListInfo = {
  list_buttons: [],
  list_file: null,
  list_file_name: null,
  list_file_type: null,
};

const ListTypeBookInfo = ({ moduleMeta, formData, setFormData, isLoading }) => {
  const listType = moduleMeta?.list_type;

  // Single source of truth — always read straight from formData, never a local copy.
  const listInfo = formData?.meta?.list_book_info || emptyListInfo;

  const buttonCount = listInfo.list_buttons?.length || 0;
  const listButtons = buttonCount
    ? listInfo.list_buttons
    : listType === 'book'
      ? bookDefaultButtons
      : defaultButtons;

  // Generic, safe updater — merges a partial patch into formData.meta.list_book_info
  const updateListInfo = (patch) => {
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        list_book_info: {
          ...emptyListInfo,
          ...prev.meta?.list_book_info,
          ...patch,
        },
      },
    }));
  };

  // Seed default buttons into formData once, so even if the user never touches
  // the buttons section, the defaults still get saved on submit.
  useEffect(() => {
    if (isLoading) return;
    if (buttonCount === 0) {
      updateListInfo({ list_buttons: listType === 'book' ? bookDefaultButtons : defaultButtons });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, listType, buttonCount]);

  const {
    file: docBase64,
    fileName: docFileName,
    fileType: docFileType,
    error: docError,
    handleFileChange: handleDocChange,
    resetFile: resetDoc,
    setFileUrl: setDocUrl,
  } = useDocumentUpload(20);

  // Hydrate the uploader once an existing file becomes available (edit mode)
  useEffect(() => {
    if (listInfo.list_file) {
      setDocUrl({
        file: listInfo.list_file,
        name: listInfo.list_file_name || 'document',
        type: listInfo.list_file_type || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listInfo.list_file]);

  // Whenever the user picks/changes a file, push it up into formData
  useEffect(() => {
    if (docBase64 === null) return; // uploader hasn't been touched yet
    updateListInfo({
      list_file: docBase64,
      list_file_name: docFileName || '',
      list_file_type: docFileType || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docBase64, docFileName, docFileType]);

  // Hooks must all run unconditionally — loading bail-out comes after them.
  if (isLoading) {
    return <Loader2 className="w-5 h-5 animate-spin" />;
  }

  const handleButtonFieldChange = (index, field, value) => {
    const updated = listButtons.map((btn, i) => (i === index ? { ...btn, [field]: value } : btn));
    updateListInfo({ list_buttons: updated });
  };

  const handleAddButton = () => {
    updateListInfo({ list_buttons: [...listButtons, { title: '', url: '', is_default: false }] });
  };

  const handleRemoveButton = (index) => {
    updateListInfo({ list_buttons: listButtons.filter((_, i) => i !== index) });
  };

  const handleRemoveDoc = () => {
    resetDoc();
    updateListInfo({ list_file: null, list_file_name: null, list_file_type: null });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">List Type Info</h3>
        <p className="text-xs text-gray-400 mt-0.5">List type and button configuration</p>
      </div>

      <div className="space-y-3">
        <Label>Buttons</Label>

        {listButtons?.length > 0 && listButtons.map((btn, index) => {
          const isDetails = btn.is_default && btn.key === 'details';
          return (
            <div key={index} className="rounded-md border border-gray-100 bg-gray-50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {btn.is_default
                    ? (btn.key === 'details' ? 'Details Button' : 'Buy Button')
                    : `Custom Button ${index + 1}`}
                </span>
                {!btn.is_default && (
                  <button
                    type="button"
                    onClick={() => handleRemoveButton(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <Input
                placeholder="Button Title"
                value={btn.title}
                onChange={(e) => handleButtonFieldChange(index, 'title', e.target.value)}
              />

              {isDetails ? (
                <p className="text-[11px] text-gray-400">URL: {btn.url} (fixed)</p>
              ) : (
                <Input
                  placeholder="Button URL"
                  value={btn.url}
                  onChange={(e) => handleButtonFieldChange(index, 'url', e.target.value)}
                />
              )}
            </div>
          );
        })}

        {listType === 'book' && (
          <Button type="button" variant="outline" size="sm" onClick={handleAddButton} className="w-full">
            <Plus size={14} className="mr-1" /> Add Button
          </Button>
        )}
      </div>

      {listType === 'book' && (
        <div>
          <DocumentFileUploader
            label="Book Document"
            fileUrl={docBase64 || listInfo.list_file}
            fileName={docFileName || listInfo.list_file_name}
            fileType={docFileType || listInfo.list_file_type}
            error={docError}
            onFileChange={handleDocChange}
            onRemove={handleRemoveDoc}
            maxSizeMB={20}
          />
        </div>
      )}
    </div>
  );
};

export default ListTypeBookInfo;