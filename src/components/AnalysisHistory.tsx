import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { History, BarChart3, MessageSquare, Download, Trash2 } from 'lucide-react'

interface AnalysisHistoryProps {
  results: any[]
  onSelectResult: (result: any) => void
}

export function AnalysisHistory({ results, onSelectResult }: AnalysisHistoryProps) {
  // Sample history data for demonstration
  const sampleHistory = [
    {
      id: '1',
      type: 'visualization',
      title: 'Sales Trend Analysis',
      description: 'Created a line chart showing monthly sales trends',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      dataset: 'sales_data.csv',
      status: 'completed'
    },
    {
      id: '2',
      type: 'analysis',
      title: 'Correlation Analysis',
      description: 'Found strong correlation between marketing spend and revenue',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      dataset: 'marketing_data.json',
      status: 'completed'
    },
    {
      id: '3',
      type: 'visualization',
      title: 'Customer Segmentation',
      description: 'Created pie chart showing customer distribution by region',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      dataset: 'customer_data.xlsx',
      status: 'completed'
    },
    {
      id: '4',
      type: 'analysis',
      title: 'Statistical Summary',
      description: 'Generated descriptive statistics for all numeric columns',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      dataset: 'product_data.csv',
      status: 'completed'
    }
  ]

  const combinedResults = [...sampleHistory, ...results]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visualization':
        return <BarChart3 className="h-4 w-4" />
      case 'analysis':
        return <MessageSquare className="h-4 w-4" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visualization':
        return 'bg-blue-100 text-blue-800'
      case 'analysis':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  if (combinedResults.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analysis History</h2>
          <p className="text-gray-600">View and manage your previous analyses</p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
            <p className="text-gray-600">Start analyzing your data to see results here</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analysis History</h2>
          <p className="text-gray-600">View and manage your previous analyses</p>
        </div>
        <Badge variant="secondary">
          {combinedResults.length} result{combinedResults.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Recent Analyses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {combinedResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getTypeColor(result.type)}>
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(result.type)}
                            <span className="capitalize">{result.type}</span>
                          </div>
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatTimeAgo(result.timestamp)}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-1">
                        {result.title}
                      </h4>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {result.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Dataset: {result.dataset}</span>
                        <Badge variant="outline" className="text-xs">
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectResult(result)}
                      >
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {combinedResults.filter(r => r.type === 'visualization').length}
              </p>
              <p className="text-sm text-gray-600">Visualizations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {combinedResults.filter(r => r.type === 'analysis').length}
              </p>
              <p className="text-sm text-gray-600">Analyses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {new Set(combinedResults.map(r => r.dataset)).size}
              </p>
              <p className="text-sm text-gray-600">Datasets Used</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}