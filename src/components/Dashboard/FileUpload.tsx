
import { useState, useRef } from 'react';
import { parseCSV, parsePDF, analyzeDataSchema } from '@/utils/fileParsingUtils';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileType, File, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { getFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from '@/utils/localStorageUtils';
import { RecentFile } from './RecentFiles';

interface FileUploadProps {
  onDataExtracted: (data: any[]) => void;
}

export const FileUpload = ({ onDataExtracted }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setIsLoading(true);
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    try {
      let extractedData: any[] = [];
      
      if (fileExtension === 'csv') {
        extractedData = await parseCSV(file);
      } else if (fileExtension === 'pdf') {
        extractedData = await parsePDF(file);
      } else {
        throw new Error(`Unsupported file format: ${fileExtension}`);
      }
      
      if (extractedData.length > 0) {
        // Save to recent files
        saveToRecentFiles(file, extractedData);
        
        // Send data to parent component
        onDataExtracted(extractedData);
        
        toast({
          title: "File processed successfully",
          description: `Extracted ${extractedData.length} records from ${file.name}`,
        });
      } else {
        throw new Error("No data could be extracted from the file");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveToRecentFiles = (file: File, data: any[]) => {
    try {
      // Get existing recent files
      const recentFiles = getFromLocalStorage<RecentFile[]>(STORAGE_KEYS.RECENT_FILES, []);
      
      // Create new recent file entry
      const newRecentFile: RecentFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type || file.name.split('.').pop() || 'unknown',
        size: file.size,
        records: data.length,
        uploadedAt: Date.now(),
        // Store a small preview of the data (first 5 records)
        previewData: data.slice(0, 5)
      };
      
      // Add to the beginning of the array (most recent first)
      const updatedRecentFiles = [newRecentFile, ...recentFiles].slice(0, 10); // Keep only 10 most recent
      
      // Save to local storage
      saveToLocalStorage(STORAGE_KEYS.RECENT_FILES, updatedRecentFiles);
    } catch (error) {
      console.error("Error saving recent file:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors relative ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".csv,.pdf"
        />
        
        <Label 
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center gap-4 cursor-pointer h-32"
        >
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">
              Drag & drop your file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: CSV, PDF
            </p>
          </div>
        </Label>
      </div>
      
      {selectedFile && (
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-background p-2">
              {selectedFile.name.endsWith('.csv') ? (
                <FileText className="h-5 w-5 text-primary" />
              ) : selectedFile.name.endsWith('.pdf') ? (
                <FileType className="h-5 w-5 text-primary" />
              ) : (
                <File className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            {isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      )}
      
      <Separator />
      
      <div className="flex flex-col items-center justify-center pt-2">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          variant="default"
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Select File
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
