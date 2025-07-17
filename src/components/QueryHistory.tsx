import { Clock, MessageSquare, TrendingUp, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

interface QueryHistoryProps {
  history: any[]
}

export function QueryHistory({ history }: QueryHistoryProps) {
  // Mock history data for demonstration
  const mockHistory = [
    {
      id: '1',
      query: 'What are the key insights from this data?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'insight',
      status: 'completed'
    },
    {
      id: '2',
      query: 'Show me the distribution of values',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'visualization',
      status: 'completed'
    },
    {
      id: '3',
      query: 'Are there any correlations I should know about?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'analysis',
      status: 'completed'
    },
    {
      id: '4',
      query: 'Can you identify any outliers or anomalies?',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'analysis',
      status: 'completed'
    },
    {
      id: '5',
      query: 'What visualizations would be most helpful?',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'visualization',
      status: 'completed'
    }
  ]

  const displayHistory = history.length > 0 ? history : mockHistory

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'insight':
        return <TrendingUp className="w-4 h-4 text-blue-600" />
      case 'visualization':
        return <TrendingUp className="w-4 h-4 text-purple-600" />
      case 'analysis':
        return <MessageSquare className="w-4 h-4 text-green-600" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'insight':
        return 'bg-blue-100 text-blue-800'
      case 'visualization':
        return 'bg-purple-100 text-purple-800'
      case 'analysis':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Query History</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-3">
            {displayHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No queries yet</p>
                <p className="text-xs text-gray-500">Start analyzing your data to see history</p>
              </div>
            ) : (
              displayHistory.map((item) => (
                <div key={item.id} className="group p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      {getTypeIcon(item.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.query}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(item.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Results</DropdownMenuItem>
                        <DropdownMenuItem>Rerun Query</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {displayHistory.length > 0 && (
          <div className="p-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              View All History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}