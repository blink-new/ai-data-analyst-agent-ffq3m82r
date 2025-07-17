import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataUpload } from './DataUpload'
import { ChatInterface } from './ChatInterface'
import { DataVisualization } from './DataVisualization'
import { AnalysisHistory } from './AnalysisHistory'
import { BarChart3, MessageSquare, Upload, History } from 'lucide-react'

interface DashboardProps {
  user: any
}

export function Dashboard({ user }: DashboardProps) {
  const [currentDataset, setCurrentDataset] = useState(null)
  const [analysisResults, setAnalysisResults] = useState([])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">AI Data Analyst</h1>
            <p className="text-sm text-gray-600">Your intelligent data analysis companion</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">Welcome, {user.email}</div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="visualize" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visualize
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <DataUpload 
              onDataUpload={setCurrentDataset}
            />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-6 h-[600px]">
                  <ChatInterface 
                    currentDataset={currentDataset}
                    onAnalysisResult={(result) => setAnalysisResults(prev => [...prev, result])}
                  />
                </Card>
              </div>
              <div className="space-y-4">
                {currentDataset && (
                  <Card className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Current Dataset</h3>
                    <p className="text-sm text-gray-600">{currentDataset.name || currentDataset.filename}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentDataset.totalRows || currentDataset.rows} rows • {currentDataset.columns} columns
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentDataset.type?.toUpperCase()} • {((currentDataset.size || 0) / 1024).toFixed(1)}KB
                    </p>
                    {currentDataset.columnInfo && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Column Types:</p>
                        <div className="flex flex-wrap gap-1">
                          {currentDataset.columnInfo.slice(0, 3).map((col: any, idx: number) => (
                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {col.name} ({col.type})
                            </span>
                          ))}
                          {currentDataset.columnInfo.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{currentDataset.columnInfo.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                )}
                <Card className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• "Show me the summary statistics"</p>
                    <p>• "What are the trends in sales?"</p>
                    <p>• "Find correlations between variables"</p>
                    <p>• "Create a chart for revenue by month"</p>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visualize" className="space-y-6">
            <Card className="p-6">
              <DataVisualization 
                dataset={currentDataset}
                analysisResults={analysisResults}
              />
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="p-6">
              <AnalysisHistory 
                results={analysisResults}
                onSelectResult={(result) => console.log('Selected:', result)}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}