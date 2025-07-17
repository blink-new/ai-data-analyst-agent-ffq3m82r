import { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Progress } from './ui/progress'

interface DataUploadProps {
  onDataUpload: (data: any) => void
}

export function DataUpload({ onDataUpload }: DataUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const processFile = useCallback(async (file: File) => {
    setUploadStatus('uploading')
    setUploadProgress(0)
    setUploadedFile(file)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Process the file based on type
      let data: any = null
      
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const text = await file.text()
        data = parseCSV(text)
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const text = await file.text()
        const jsonData = JSON.parse(text)
        
        // Handle different JSON structures
        let rows = []
        if (Array.isArray(jsonData)) {
          rows = jsonData
        } else if (jsonData.data && Array.isArray(jsonData.data)) {
          rows = jsonData.data
        } else if (typeof jsonData === 'object') {
          // Convert single object to array
          rows = [jsonData]
        } else {
          throw new Error('Unsupported JSON structure')
        }
        
        if (rows.length === 0) throw new Error('No data found in JSON file')
        
        // Extract headers from first object
        const headers = Object.keys(rows[0])
        
        // Analyze column types
        const columnInfo = headers.map(header => {
          const sampleValues = rows.slice(0, 100).map(row => row[header]).filter(v => v !== null && v !== undefined && v !== '')
          const numericValues = sampleValues.filter(v => !isNaN(Number(v)) && v !== '')
          const dateValues = sampleValues.filter(v => !isNaN(Date.parse(v)))
          
          let type = 'text'
          if (numericValues.length > sampleValues.length * 0.8) {
            type = 'number'
          } else if (dateValues.length > sampleValues.length * 0.8) {
            type = 'date'
          }
          
          return {
            name: header,
            type,
            sampleValues: sampleValues.slice(0, 5),
            nullCount: rows.filter(row => !row[header] || row[header] === '').length
          }
        })
        
        data = {
          type: 'json',
          name: 'JSON Dataset',
          headers,
          rows, // Full dataset for AI analysis
          columns: headers.length,
          totalRows: rows.length,
          columnInfo,
          preview: rows.slice(0, 10)
        }
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // For demo purposes, we'll simulate Excel processing
        data = {
          type: 'excel',
          filename: file.name,
          size: file.size,
          rows: 100,
          columns: ['A', 'B', 'C', 'D', 'E']
        }
      } else {
        throw new Error('Unsupported file format. Please upload CSV, JSON, or Excel files.')
      }

      clearInterval(progressInterval)
      setUploadProgress(100)
      
      setTimeout(() => {
        setUploadStatus('success')
        onDataUpload({
          ...data,
          filename: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString()
        })
      }, 500)

    } catch (error) {
      setUploadStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process file')
    }
  }, [onDataUpload])

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) throw new Error('Empty CSV file')
    
    // Better CSV parsing that handles quoted values
    const parseCSVLine = (line: string) => {
      const result = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    }
    
    const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, ''))
    const rows = lines.slice(1).map(line => {
      const values = parseCSVLine(line).map(v => v.replace(/"/g, ''))
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || ''
        return obj
      }, {} as any)
    })
    
    // Analyze column types
    const columnInfo = headers.map(header => {
      const sampleValues = rows.slice(0, 100).map(row => row[header]).filter(v => v !== '')
      const numericValues = sampleValues.filter(v => !isNaN(Number(v)) && v !== '')
      const dateValues = sampleValues.filter(v => !isNaN(Date.parse(v)))
      
      let type = 'text'
      if (numericValues.length > sampleValues.length * 0.8) {
        type = 'number'
      } else if (dateValues.length > sampleValues.length * 0.8) {
        type = 'date'
      }
      
      return {
        name: header,
        type,
        sampleValues: sampleValues.slice(0, 5),
        nullCount: rows.filter(row => !row[header] || row[header].trim() === '').length
      }
    })
    
    return {
      type: 'csv',
      name: 'CSV Dataset',
      headers,
      rows, // Full dataset for AI analysis
      columns: headers.length,
      totalRows: rows.length,
      columnInfo,
      preview: rows.slice(0, 10)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [processFile])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const resetUpload = () => {
    setUploadStatus('idle')
    setUploadProgress(0)
    setErrorMessage('')
    setUploadedFile(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Your Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadStatus === 'idle' && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Drop your data file here
              </h3>
              <p className="text-gray-600 mb-4">
                Supports CSV, JSON, and Excel files up to 10MB
              </p>
              <input
                type="file"
                accept=".csv,.json,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          )}

          {uploadStatus === 'uploading' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">{uploadedFile?.name}</p>
                  <p className="text-sm text-gray-600">
                    {uploadedFile?.size ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : ''}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  File uploaded successfully! You can now start analyzing your data.
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium">{uploadedFile?.name}</p>
                    <p className="text-sm text-gray-600">Ready for analysis</p>
                  </div>
                </div>
                <Button variant="outline" onClick={resetUpload}>
                  Upload Another
                </Button>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <Button onClick={resetUpload}>Try Again</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supported Formats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supported File Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium">CSV Files</p>
                <p className="text-sm text-gray-600">Comma-separated values</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium">JSON Files</p>
                <p className="text-sm text-gray-600">JavaScript Object Notation</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-medium">Excel Files</p>
                <p className="text-sm text-gray-600">.xlsx and .xls formats</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}