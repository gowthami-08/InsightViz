
import { DataItem } from '@/utils/dataUtils';
import data from '@/data/jsondata.json';
import initSqlJs from 'sql.js';

// Create a promise to initialize SQL.js
let dbPromise: Promise<initSqlJs.Database>;
let dbInstance: initSqlJs.Database | null = null;

// Initialize the database
export const initDatabase = async (): Promise<void> => {
  try {
    // Load SQL.js
    const SQL = await initSqlJs({
      // Locate the wasm file
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    
    // Create a database
    const db = new SQL.Database();
    
    // Create tables
    db.run(`
      CREATE TABLE IF NOT EXISTS insights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        end_year INTEGER,
        intensity INTEGER,
        sector TEXT,
        topic TEXT,
        insight TEXT,
        url TEXT,
        region TEXT,
        start_year INTEGER,
        impact TEXT,
        added TEXT,
        published TEXT,
        country TEXT,
        relevance INTEGER,
        pestle TEXT,
        source TEXT,
        title TEXT,
        likelihood INTEGER
      )
    `);

    // Prepare insert statement
    const stmt = db.prepare(`
      INSERT INTO insights (
        end_year, intensity, sector, topic, insight, url, region, 
        start_year, impact, added, published, country, relevance, 
        pestle, source, title, likelihood
      ) VALUES (
        $end_year, $intensity, $sector, $topic, $insight, $url, $region, 
        $start_year, $impact, $added, $published, $country, $relevance, 
        $pestle, $source, $title, $likelihood
      )
    `);

    // Insert data
    db.exec('BEGIN TRANSACTION');
    
    for (const item of data) {
      stmt.run({
        $end_year: item.end_year || null,
        $intensity: item.intensity || null,
        $sector: item.sector || null,
        $topic: item.topic || null,
        $insight: item.insight || null,
        $url: item.url || null,
        $region: item.region || null,
        $start_year: item.start_year || null,
        $impact: item.impact || null,
        $added: item.added || null,
        $published: item.published || null,
        $country: item.country || null,
        $relevance: item.relevance || null,
        $pestle: item.pestle || null,
        $source: item.source || null,
        $title: item.title || null,
        $likelihood: item.likelihood || null
      });
    }
    
    db.exec('COMMIT');
    
    console.log(`Inserted ${data.length} records into the database`);
    dbInstance = db;
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Ensure database is initialized
const getDb = async (): Promise<initSqlJs.Database> => {
  if (!dbInstance) {
    if (!dbPromise) {
      dbPromise = initDatabase();
    }
    await dbPromise;
    if (!dbInstance) {
      throw new Error('Database failed to initialize');
    }
  }
  return dbInstance;
};

// Execute a query and parse the results
const executeQuery = async <T>(query: string, params?: any): Promise<T[]> => {
  const db = await getDb();
  const result = db.exec(query, params);
  
  if (result.length === 0) {
    return [];
  }
  
  const columns = result[0].columns;
  const rows = result[0].values;
  
  return rows.map(row => {
    const obj: any = {};
    columns.forEach((column, index) => {
      obj[column] = row[index];
    });
    return obj as T;
  });
};

// Get all data
export const getAllInsights = async (): Promise<DataItem[]> => {
  return executeQuery<DataItem>('SELECT * FROM insights');
};

// Get filtered data
export const getFilteredInsights = async (filters: Record<string, any>): Promise<DataItem[]> => {
  let query = 'SELECT * FROM insights WHERE 1=1';
  const params: any[] = [];

  // Build query dynamically based on filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      query += ` AND ${key} = ?`;
      params.push(value);
    }
  });

  return executeQuery<DataItem>(query, params);
};

// Get unique values for a field
export const getUniqueValues = async (field: string): Promise<string[]> => {
  const result = await executeQuery<{value: string}>(`
    SELECT DISTINCT ${field} as value 
    FROM insights 
    WHERE ${field} IS NOT NULL 
    ORDER BY ${field}
  `);
  return result.map(row => row.value);
};

// Get average intensity by sector
export const getAverageIntensityBySector = async (): Promise<{ sector: string; value: number }[]> => {
  return executeQuery<{ sector: string; value: number }>(`
    SELECT sector, ROUND(AVG(intensity), 2) as value 
    FROM insights 
    WHERE sector IS NOT NULL 
    GROUP BY sector 
    ORDER BY value DESC
  `);
};

// Get average likelihood by region
export const getAverageLikelihoodByRegion = async (): Promise<{ region: string; value: number }[]> => {
  return executeQuery<{ region: string; value: number }>(`
    SELECT region, ROUND(AVG(likelihood), 2) as value 
    FROM insights 
    WHERE region IS NOT NULL 
    GROUP BY region 
    ORDER BY value DESC
  `);
};

// Get average relevance by topic
export const getAverageRelevanceByTopic = async (): Promise<{ topic: string; value: number }[]> => {
  return executeQuery<{ topic: string; value: number }>(`
    SELECT topic, ROUND(AVG(relevance), 2) as value 
    FROM insights 
    WHERE topic IS NOT NULL 
    GROUP BY topic 
    ORDER BY value DESC
  `);
};

// Get data by year
export const getDataByYear = async (): Promise<{ year: number; count: number }[]> => {
  // This is a simplified query for sql.js
  // First, get unique years
  const years = await executeQuery<{ year: number }>(`
    SELECT start_year as year FROM insights WHERE start_year IS NOT NULL
    UNION
    SELECT end_year as year FROM insights WHERE end_year IS NOT NULL
    ORDER BY year
  `);
  
  // Then count insights for each year
  const result: { year: number; count: number }[] = [];
  
  for (const yearObj of years) {
    const year = yearObj.year;
    const counts = await executeQuery<{ count: number }>(`
      SELECT COUNT(*) as count FROM insights 
      WHERE (start_year IS NULL OR start_year <= ?) 
      AND (end_year IS NULL OR end_year >= ?)
    `, [year, year]);
    
    result.push({
      year,
      count: counts[0].count
    });
  }
  
  return result;
};

// Get top insights by intensity
export const getTopInsightsByIntensity = async (limit: number = 10): Promise<{ title: string; intensity: number; sector: string; topic: string }[]> => {
  return executeQuery<{ title: string; intensity: number; sector: string; topic: string }>(`
    SELECT title, intensity, sector, topic 
    FROM insights 
    ORDER BY intensity DESC 
    LIMIT ${limit}
  `);
};

// Count by field
export const countByField = async (field: string): Promise<{ name: string; value: number }[]> => {
  return executeQuery<{ name: string; value: number }>(`
    SELECT ${field} as name, COUNT(*) as value 
    FROM insights 
    WHERE ${field} IS NOT NULL 
    GROUP BY ${field} 
    ORDER BY value DESC
  `);
};
