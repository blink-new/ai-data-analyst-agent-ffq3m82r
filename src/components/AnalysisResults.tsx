import { FileText, TrendingUp, AlertCircle, CheckCircle, Download, Share } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

interface AnalysisResultsProps {
  results: any
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  if (!results) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
            <p className="text-gray-600">Start a conversation with the AI to generate analysis results</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const mockResults = {
    summary: {
      totalRecords: 1250,
      completeness: 98.5,
      quality: 'High',
      lastUpdated: new Date().toLocaleDateString()
    },
    insights: [
      {
        type: 'trend',
        title: 'Positive Growth Trend',
        description: 'Data shows a consistent 15% month-over-month growth pattern',
        confidence: 92,
        impact: 'high'
      },
      {
        type: 'correlation',
        title: 'Strong Variable Correlation',
        description: 'Variables A and B show 0.87 correlation coefficient',
        confidence: 88,
        impact: 'medium'
      },
      {
        type: 'anomaly',
        title: 'Outliers Detected',
        description: '3.2% of records contain potential outliers requiring attention',
        confidence: 76,
        impact: 'low'
      }
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'Data Cleaning',
        description: 'Remove or investigate outliers in the dataset',
        action: 'Review records with values > 3 standard deviations'
      },
      {
        priority: 'medium',
        title: 'Feature Engineering',
        description: 'Create derived features from correlated variables',
        action: 'Combine variables A and B for better predictive power'
      },
      {
        priority: 'low',
        title: 'Data Collection',
        description: 'Increase sample size for better statistical significance',
        action: 'Collect additional 500 records over next month'
      }
    ],
    statistics: {
      mean: 45.7,
      median: 42.3,
      mode: 38.1,
      standardDeviation: 12.4,
      variance: 153.76,
      skewness: 0.23
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Analysis Results</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{mockResults.summary.totalRecords.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Records</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{mockResults.summary.completeness}%</p>
              <p className="text-sm text-gray-600">Data Completeness</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{mockResults.summary.quality}</p>
              <p className="text-sm text-gray-600">Data Quality</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{mockResults.summary.lastUpdated}</p>
              <p className="text-sm text-gray-600">Last Updated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Key Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockResults.insights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact}
                      </Badge>
                      <span className="text-sm text-gray-500">{insight.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${insight.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockResults.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                    <strong>Action:</strong> {rec.action}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistical Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Statistical Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{mockResults.statistics.mean}</p>
              <p className="text-sm text-gray-600">Mean</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{mockResults.statistics.median}</p>
              <p className="text-sm text-gray-600">Median</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{mockResults.statistics.mode}</p>
              <p className="text-sm text-gray-600">Mode</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{mockResults.statistics.standardDeviation}</p>
              <p className="text-sm text-gray-600">Std Dev</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{mockResults.statistics.variance}</p>
              <p className="text-sm text-gray-600">Variance</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{mockResults.statistics.skewness}</p>
              <p className="text-sm text-gray-600">Skewness</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis History */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Data distribution analysis</p>
                  <p className="text-xs text-gray-600">Completed 2 minutes ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Correlation analysis</p>
                  <p className="text-xs text-gray-600">Completed 5 minutes ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Outlier detection</p>
                  <p className="text-xs text-gray-600">Completed 8 minutes ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}