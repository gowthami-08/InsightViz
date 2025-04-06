
// Utility functions for parsing uploaded files

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
        
        // Extract headers (first line)
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Parse data rows
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split(',').map(value => value.trim());
          
          if (values.length !== headers.length) {
            console.warn(`Line ${i} has ${values.length} values, but there are ${headers.length} headers`);
            continue; // Skip malformed rows
          }
          
          const entry: Record<string, any> = {};
          
          for (let j = 0; j < headers.length; j++) {
            // Try to convert numeric values
            const value = values[j];
            if (value === '') {
              entry[headers[j]] = null;
            } else if (!isNaN(Number(value))) {
              entry[headers[j]] = Number(value);
            } else {
              entry[headers[j]] = value;
            }
          }
          
          data.push(entry);
        }
        
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
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
