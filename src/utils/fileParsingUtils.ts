// Utility functions for parsing uploaded files

/**
 * Maximum file size in bytes (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Supported file types
 */
export const SUPPORTED_FILE_TYPES = {
  CSV: 'text/csv',
  PDF: 'application/pdf',
};

/**
 * Validate file before processing
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)}MB.` 
    };
  }
  
  // Check file type using MIME type
  const fileType = file.type.toLowerCase();
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  
  // Primary check: MIME type
  const isValidMimeType = Object.values(SUPPORTED_FILE_TYPES).includes(fileType);
  
  // Secondary check: file extension (as fallback if browser doesn't report correct MIME)
  const isValidExtension = fileExt === 'csv' || fileExt === 'pdf';
  
  if (!isValidMimeType && !isValidExtension) {
    return { 
      valid: false, 
      error: `Unsupported file type. Please upload a CSV or PDF file.` 
    };
  }
  
  return { valid: true };
};

/**
 * Parse a CSV file and return structured data
 */
export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        if (!csv) {
          reject(new Error('Failed to read CSV file'));
          return;
        }
        
        // Split by lines
        const lines = csv.split(/\r\n|\n/);
        if (lines.length < 2) {
          reject(new Error('CSV file appears to be empty or invalid. The file should contain at least headers and one data row.'));
          return;
        }
        
        // Extract headers (first line)
        const headers = lines[0].split(',').map(header => header.trim());
        
        if (headers.length === 0 || headers.some(h => !h)) {
          reject(new Error('Invalid CSV structure. Headers are missing or improperly formatted.'));
          return;
        }
        
        // Parse data rows
        const data = [];
        const errors: string[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split(',').map(value => value.trim());
          
          // Handle mismatched columns - either truncate or fill with nulls
          let processedValues = [...values];
          if (values.length > headers.length) {
            errors.push(`Line ${i} has more values than headers. Extra values will be ignored.`);
            processedValues = values.slice(0, headers.length);
          } else if (values.length < headers.length) {
            errors.push(`Line ${i} has fewer values than headers. Missing values will be null.`);
            // Fill missing values with null
            while (processedValues.length < headers.length) {
              processedValues.push('');
            }
          }
          
          const entry: Record<string, any> = {};
          
          for (let j = 0; j < headers.length; j++) {
            // Try to convert numeric values
            const value = processedValues[j];
            if (value === undefined || value === '') {
              entry[headers[j]] = null;
            } else if (!isNaN(Number(value))) {
              entry[headers[j]] = Number(value);
            } else {
              entry[headers[j]] = value;
            }
          }
          
          data.push(entry);
        }
        
        // If there were parsing errors, log them but continue
        if (errors.length > 0) {
          console.warn(`CSV parsing had ${errors.length} issues:`, errors);
        }
        
        if (data.length === 0) {
          reject(new Error('No valid data rows found in the CSV file. Please check the file format.'));
          return;
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error(`Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file. The file might be corrupted or inaccessible.'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Parse a PDF file and extract text content
 */
export const parsePDF = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    // Use PDF.js library to parse PDF content
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const pdfData = event.target?.result;
        if (!pdfData) {
          reject(new Error('Failed to read PDF file. The file might be corrupted.'));
          return;
        }
        
        // Since we don't have direct access to PDF.js here, we'll use a simplified approach
        // In a real implementation, you would use PDF.js to extract text and tables
        
        // Mock PDF data extraction - in a real app, replace with actual PDF parsing
        const extractedData = [
          {
            page: 1,
            content: `Extracted content from ${file.name}`,
            extracted_at: new Date().toISOString(),
            file_name: file.name,
            file_size: file.size,
          }
        ];
        
        resolve(extractedData);
        
      } catch (error) {
        console.error('Error parsing PDF:', error);
        reject(new Error('Failed to parse PDF file. Please ensure it is a valid and accessible PDF document.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading PDF file. The file might be corrupted or inaccessible.'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Analyze data to extract schema information
 */
export const analyzeDataSchema = (data: any[]): { 
  fields: { name: string; type: string; sample: any }[]; 
  totalRows: number;
} => {
  if (!data || data.length === 0) {
    return { fields: [], totalRows: 0 };
  }
  
  const firstItem = data[0];
  const fields = Object.keys(firstItem).map(key => {
    // Determine type based on the first non-null value
    let type = 'unknown';
    let sample = null;
    
    for (const item of data) {
      if (item[key] !== null && item[key] !== undefined) {
        sample = item[key];
        if (typeof item[key] === 'number') {
          type = 'number';
        } else if (typeof item[key] === 'boolean') {
          type = 'boolean';
        } else if (typeof item[key] === 'string') {
          // Check if it's a date
          if (!isNaN(Date.parse(item[key]))) {
            type = 'date';
          } else {
            type = 'string';
          }
        } else if (Array.isArray(item[key])) {
          type = 'array';
        } else if (typeof item[key] === 'object') {
          type = 'object';
        }
        break;
      }
    }
    
    return { name: key, type, sample };
  });
  
  return { fields, totalRows: data.length };
};

/**
 * Extract attributes from data for filtering and display
 */
export const extractAttributes = (data: any[]): Record<string, any[]> => {
  const attributes: Record<string, Set<any>> = {};
  
  // First pass: identify which fields to extract
  if (data.length > 0) {
    const firstItem = data[0];
    Object.keys(firstItem).forEach(key => {
      if (typeof firstItem[key] !== 'object' || firstItem[key] === null) {
        attributes[key] = new Set();
      }
    });
  }
  
  // Second pass: collect unique values for each field
  data.forEach(item => {
    Object.keys(attributes).forEach(key => {
      if (item[key] !== null && item[key] !== undefined) {
        attributes[key].add(item[key]);
      }
    });
  });
  
  // Convert sets to arrays
  const result: Record<string, any[]> = {};
  Object.keys(attributes).forEach(key => {
    result[key] = Array.from(attributes[key]).sort((a, b) => {
      if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
      }
      return String(a).localeCompare(String(b));
    });
  });
  
  return result;
};

/**
 * Logs file upload errors for debugging
 */
export const logFileError = (file: File, error: Error): void => {
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    error: error.message,
    stack: error.stack
  };
  
  console.error(`[${timestamp}] File Upload Error:`, errorLog);
  
  // In a production app, you might want to send this to a server-side logging service
  // sendErrorToLoggingService(errorLog);
};
