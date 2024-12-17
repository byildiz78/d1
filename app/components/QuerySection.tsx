'use client'

import { useState } from 'react'
import { executeQuery } from '../actions/database'

export default function QuerySection() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await executeQuery(query)
      if (response.success) {
        setResult(response)
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">SQL Sorgusu</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-32 p-2 border rounded-md"
          placeholder="SELECT * FROM table_name"
        />
        
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Çalıştırılıyor...' : 'Çalıştır'}
        </button>
      </form>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            {result.rowsAffected} satır etkilendi
          </div>
          
          {result.data && result.data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-md">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(result.data[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left border-b">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {Object.values(row).map((value: any, j: number) => (
                        <td key={j} className="px-4 py-2 border-b">
                          {value?.toString() ?? 'NULL'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
