
import { useState, useRef } from 'react';
import { parseCSV, parsePDF, analyzeDataSchema, validateFile } from '@/utils/fileParsingUtils';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileType, File, FileText, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { getFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from '@/utils/localStorageUtils';
import { RecentFile } from './RecentFiles';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onDataExtracted: (data: any[]) => void;
}

export const FileUpload = ({ onDataExtracted }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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
    setProcessProgress(0);
    setUploadSuccess(false);
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Validate file first
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      let extractedData: any[] = [];
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProcessProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.2;
          return Math.min(newProgress, 95);
        });
      }, 300);
      
      if (fileExtension === 'csv') {
        extractedData = await parseCSV(file);
      } else if (fileExtension === 'pdf') {
        extractedData = await parsePDF(file);
      } else {
        throw new Error(`Unsupported file format: ${fileExtension}`);
      }
      
      clearInterval(progressInterval);
      
      if (extractedData.length > 0) {
        // Save to recent files
        saveToRecentFiles(file, extractedData);
        
        // Set progress to 100%
        setProcessProgress(100);
        
        // Indicate success
        setUploadSuccess(true);
        
        // Send data to parent component
        onDataExtracted(extractedData);
        
        toast({
          title: "File processed successfully",
          description: `Extracted ${extractedData.length} records from ${file.name}`,
        });
        
        // Animate transition
        setTimeout(() => {
          // Trigger tab change from parent component
        }, 1500);
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
          dragActive ? 'border-primary bg-primary/5' : uploadSuccess ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-muted-foreground/25'
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
          {uploadSuccess ? (
            <div className="flex flex-col items-center justify-center animate-fade-in">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center space-y-1 mt-4">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Upload Complete!
                </p>
                <p className="text-xs text-muted-foreground">
                  Your file has been processed successfully.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className={`rounded-full ${isLoading ? 'bg-primary/20' : 'bg-primary/10'} p-3`}>
                <Upload className={`h-6 w-6 ${isLoading ? 'text-primary/50' : 'text-primary'}`} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">
                  {isLoading ? 'Processing your file...' : 'Drag & drop your file here or click to browse'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: CSV, PDF
                </p>
              </div>
            </>
          )}
        </Label>
        
        {isLoading && (
          <div className="absolute inset-x-0 bottom-4 px-6">
            <Progress value={processProgress} className="h-1" />
            <p className="text-xs text-center text-muted-foreground mt-2">
              {processProgress < 30 ? 'Reading file...' : 
               processProgress < 60 ? 'Processing data...' : 
               processProgress < 90 ? 'Analyzing content...' : 
               'Finalizing...'}
            </p>
          </div>
        )}
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
            {uploadSuccess && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
        </div>
      )}
      
      <Separator />
      
      <div className="flex flex-col items-center justify-center pt-2">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          variant={uploadSuccess ? "outline" : "default"}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : uploadSuccess ? (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Another File
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
