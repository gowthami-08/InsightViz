
import { useState, useRef } from 'react';
import { Upload, File, FileText, X, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { parseCSV, parsePDF } from '@/utils/fileParsingUtils';

interface FileUploadProps {
  onDataExtracted: (data: any[]) => void;
}

export const FileUpload = ({ onDataExtracted }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<Record<string, 'pending' | 'success' | 'error'>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    // Validate files
    for (const file of files) {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExt === 'csv' || fileExt === 'pdf') {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: Unsupported file type. Only CSV and PDF files are allowed.`);
      }
    }
    
    if (errors.length > 0) {
      setUploadErrors(prev => [...prev, ...errors]);
    }
    
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      processFiles(validFiles);
    }
  };

  const processFiles = async (files: File[]) => {
    setIsUploading(true);
    
    try {
      let parsedData: any[] = [];
      
      // Simulate upload progress
      const totalFiles = files.length;
      const newProcessingStatus: Record<string, 'pending' | 'success' | 'error'> = {};
      
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const fileId = `${file.name}-${Date.now()}`;
        
        // Update progress
        setUploadProgress(((i + 0.5) / totalFiles) * 100);
        newProcessingStatus[fileId] = 'pending';
        setProcessingStatus(prev => ({ ...prev, ...newProcessingStatus }));
        
        try {
          // Parse file based on type
          if (fileExt === 'csv') {
            const data = await parseCSV(file);
            parsedData = [...parsedData, ...data];
            newProcessingStatus[fileId] = 'success';
          } else if (fileExt === 'pdf') {
            try {
              const data = await parsePDF(file);
              parsedData = [...parsedData, ...data];
              newProcessingStatus[fileId] = 'success';
              toast.success(`Successfully extracted data from PDF: ${file.name}`);
            } catch (error) {
              console.error('PDF parsing error:', error);
              newProcessingStatus[fileId] = 'error';
              toast.error(`Error processing PDF: ${file.name}. ${error instanceof Error ? error.message : 'Unknown error'}`);
              setUploadErrors(prev => [...prev, `Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`]);
            }
          }
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          newProcessingStatus[fileId] = 'error';
          setUploadErrors(prev => [...prev, `Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`]);
        }
        
        setProcessingStatus(prev => ({ ...prev, ...newProcessingStatus }));
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }
      
      if (parsedData.length > 0) {
        onDataExtracted(parsedData);
        toast.success(`Successfully extracted data from ${files.length} file(s)`);
      } else {
        toast.error('No data could be extracted from the uploaded files.');
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error processing files. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearErrors = () => {
    setUploadErrors([]);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept=".csv,.pdf"
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Upload Files</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Drag and drop CSV or PDF files, or click to browse
          </p>
          <Button variant="outline" size="sm" onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}>
            Select Files
          </Button>
        </div>
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading and processing...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      {uploadedFiles.length > 0 && (
        <div className="border rounded-lg divide-y">
          <div className="p-3 bg-muted/50 font-medium text-sm">
            Uploaded Files
          </div>
          <ul className="divide-y">
            {uploadedFiles.map((file, index) => (
              <li key={`${file.name}-${index}`} className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {file.name.endsWith('.csv') ? (
                    <FileText className="h-5 w-5 text-blue-500" />
                  ) : (
                    <File className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {uploadErrors.length > 0 && (
        <div className="border border-destructive/50 rounded-lg divide-y">
          <div className="p-3 bg-destructive/10 font-medium text-sm text-destructive flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Upload Errors</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-destructive"
              onClick={clearErrors}
            >
              Clear All
            </Button>
          </div>
          <ul className="divide-y">
            {uploadErrors.map((error, index) => (
              <li key={index} className="p-3 text-sm text-destructive">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
