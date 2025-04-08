
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFromLocalStorage, STORAGE_KEYS } from '@/utils/localStorageUtils';
import { FileText, Clock, Calendar, BarChart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

export interface RecentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  records: number;
  uploadedAt: number;
  previewData?: any[];
}

export const RecentFiles = () => {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  
  useEffect(() => {
    const files = getFromLocalStorage<RecentFile[]>(STORAGE_KEYS.RECENT_FILES, []);
    setRecentFiles(files);
  }, []);
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  if (recentFiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
          <CardDescription>Your recently uploaded files will appear here</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <div className="rounded-full bg-muted p-6">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No recent files</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Upload files to see them here. Your recent file history will be stored locally.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Files</CardTitle>
        <CardDescription>Your recently uploaded files</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentFiles.map(file => (
            <div 
              key={file.id} 
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{file.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(file.uploadedAt), 'PPp')}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {file.records} records
                    </span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <BarChart className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visualize</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
