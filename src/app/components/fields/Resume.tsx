import React, { useState, useRef, useEffect } from 'react';

interface ResumeProps {
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  onFileUpload?: (file: File) => void;
  currentResume?: string | null;
  onDownloadResume?: () => void;
  lastUpdated?: string;
  onDeleteResume?: () => void;
  userName?: string;
  resumeContentType?: string;
}

const Resume: React.FC<ResumeProps> = ({
  errors,
  touched,
  onFileUpload,
  currentResume,
  onDownloadResume,
  lastUpdated = 'Today',
  onDeleteResume,
  userName,
  resumeContentType
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear selectedFile when resumeContentType updates (indicating parent has processed upload)
  useEffect(() => {
    if (selectedFile && resumeContentType) {
      // Check if the content type matches the selected file type
      const getFileTypeFromContentType = (contentType: string) => {
        switch (contentType) {
          case 'application/pdf':
            return 'application/pdf';
          case 'application/msword':
            return 'application/msword';
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          case 'application/rtf':
          case 'text/rtf':
            return 'application/rtf';
          default:
            return null;
        }
      };

      const expectedType = getFileTypeFromContentType(resumeContentType);
      if (expectedType && selectedFile.type === expectedType) {
        // Content type matches selected file, safe to clear
        setSelectedFile(null);
      }
    }
  }, [resumeContentType, selectedFile]);

  // Fallback: Clear selectedFile after 5 seconds if parent doesn't update resumeContentType
  useEffect(() => {
    if (selectedFile && !uploading) {
      const timeout = setTimeout(() => {
        setSelectedFile(null);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [selectedFile, uploading]);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'text/rtf'
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid file format: PDF, DOC, DOCX, or RTF');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Set the selected file to show preview with correct extension
    setSelectedFile(file);

    if (onFileUpload) {
      setUploading(true);
      try {
        await onFileUpload(file);
        // Don't clear selectedFile immediately - let it persist until parent updates
        // The selectedFile will be cleared when the component re-renders with updated props
      } catch (error) {
        console.error('Upload failed:', error);
        // Clear selected file on error
        setSelectedFile(null);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Function to format resume display name
  const getResumeDisplayName = () => {
    if (!currentResume) return '';

    // If no userName is provided, return the original filename from URL
    if (!userName) {
      // Extract filename from URL
      const urlMatch = currentResume.match(/\/([^\/\?]+)(?:\?|$)/);
      return urlMatch ? urlMatch[1] : 'resume';
    }

    // Determine file extension from content type or fallback to URL extraction
    let fileExtension = 'pdf'; // Default fallback

    // If a file is selected for upload, use its type to determine extension
    if (selectedFile) {
      switch (selectedFile.type) {
        case 'application/pdf':
          fileExtension = 'pdf';
          break;
        case 'application/msword':
          fileExtension = 'doc';
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          fileExtension = 'docx';
          break;
        case 'application/rtf':
        case 'text/rtf':
          fileExtension = 'rtf';
          break;
        default:
          // Fallback to existing content type or URL extraction
          if (resumeContentType) {
            switch (resumeContentType) {
              case 'application/pdf':
                fileExtension = 'pdf';
                break;
              case 'application/msword':
                fileExtension = 'doc';
                break;
              case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                fileExtension = 'docx';
                break;
              case 'application/rtf':
              case 'text/rtf':
                fileExtension = 'rtf';
                break;
              default:
                // Fallback to URL extraction if content type is not recognized
                const urlMatch = currentResume.match(/\.([^\/\?]+)(?:\?|$)/);
                fileExtension = urlMatch ? urlMatch[1] : 'pdf';
            }
          } else {
            // Fallback to URL extraction if no content type is provided
            const urlMatch = currentResume.match(/\.([^\/\?]+)(?:\?|$)/);
            fileExtension = urlMatch ? urlMatch[1] : 'pdf';
          }
      }
    } else if (resumeContentType) {
      // Use existing content type if no file is selected
      switch (resumeContentType) {
        case 'application/pdf':
          fileExtension = 'pdf';
          break;
        case 'application/msword':
          fileExtension = 'doc';
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          fileExtension = 'docx';
          break;
        case 'application/rtf':
        case 'text/rtf':
          fileExtension = 'rtf';
          break;
        default:
          // Fallback to URL extraction if content type is not recognized
          const urlMatch = currentResume.match(/\.([^\/\?]+)(?:\?|$)/);
          fileExtension = urlMatch ? urlMatch[1] : 'pdf';
      }
    } else {
      // Fallback to URL extraction if no content type is provided
      const urlMatch = currentResume.match(/\.([^\/\?]+)(?:\?|$)/);
      fileExtension = urlMatch ? urlMatch[1] : 'pdf';
    }

    return `${userName}.${fileExtension}`;
  };

  // Card UI when resume is uploaded
  if (currentResume) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold text-gray-800 mb-1">Update CV</label>
        <span className="text-sm text-gray-500 mb-2">An updated CV increases your chances by 60% of getting job offers</span>
        <div className="relative bg-blue-50 rounded-xl shadow-sm p-6 flex flex-col items-start w-full max-w-md">
          {/* X button */}
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Delete CV"
          >
            ×
          </button>
          {/* Preview Icon */}
          <div className="w-full flex items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center border border-blue-100">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#E6F0FA"/><rect x="6" y="7" width="12" height="2" rx="1" fill="#B3D4FC"/><rect x="6" y="11" width="8" height="2" rx="1" fill="#B3D4FC"/><rect x="6" y="15" width="5" height="2" rx="1" fill="#B3D4FC"/></svg>
            </div>
            <div className="flex-1">
              <span className="block text-base text-blue-900 font-medium rounded px-2 py-1">{getResumeDisplayName()}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">Last updated {lastUpdated}</div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleClick}
              className="px-5 py-2 rounded-full border border-blue-400 text-blue-600 font-semibold bg-white hover:bg-blue-50 transition"
              disabled={uploading}
            >
              Update CV
            </button>
            <button
              type="button"
              onClick={onDownloadResume}
              className="px-5 py-2 rounded-full border border-blue-400 text-blue-600 font-semibold bg-white hover:bg-blue-50 transition"
            >
              Download
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.rtf"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full relative">
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setShowDeleteModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="text-lg font-semibold mb-2 text-gray-800">Are you sure you want to delete CV?</div>
              <div className="text-sm text-gray-500 mb-6">You will not be able to undo this action & your CV will be removed.</div>
              <button
                type="button"
                className="w-full px-5 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                onClick={() => {
                  setShowDeleteModal(false);
                  if (onDeleteResume) onDeleteResume();
                }}
              >
                Delete CV
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Upload UI when no resume is uploaded
  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-semibold text-gray-800 mb-1">Upload CV</label>
      <div
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors w-full ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-blue-300 hover:border-blue-400'
        } ${errors.resume && touched.resume ? 'border-red-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.rtf"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-blue-600 font-semibold text-base cursor-pointer">Browse</span> <span className="text-gray-600">file to upload</span>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2">Supported file formats: doc, rtf, docx, pdf | upto 2 mb</div>
      {errors.resume && touched.resume && (
        <span className="text-xs text-red-500">{errors.resume}</span>
      )}
    </div>
  );
};

export default Resume;