'use server'

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  rowsAffected?: number;
}

if (!process.env.API_URL) {
  throw new Error('API_URL environment variable is not set');
}

if (!process.env.API_TOKEN) {
  throw new Error('API_TOKEN environment variable is not set');
}

const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation(operation: () => Promise<Response>): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await operation();
      if (response.ok || attempt === MAX_RETRIES) {
        return response;
      }
      lastError = new Error(`API returned status ${response.status}`);
    } catch (error: any) {
      lastError = error;
      if (attempt === MAX_RETRIES) {
        throw error;
      }
    }
    
    await delay(RETRY_DELAY * attempt);
  }
  
  throw lastError;
}

export async function executeQuery(query: string, params?: { startDate?: string; endDate?: string }): Promise<ApiResponse> {
  try {
    const response = await retryOperation(() => 
      fetch(`${API_URL}/api/3/query`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          ...(params && {
            startDate: params.startDate,
            endDate: params.endDate
          })
        }),
      })
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return {
      success: true,
      data: data.result || data.data || data,
      rowsAffected: data.rowsAffected
    };
  } catch (error: any) {
    console.error('API client error:', error);
    return {
      success: false,
      error: `Sorgu çalıştırılırken hata oluştu: ${error.message}`
    };
  }
}
