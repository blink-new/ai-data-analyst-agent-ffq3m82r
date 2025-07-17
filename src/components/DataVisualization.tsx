import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp } from 'lucide-react'

interface DataVisualizationProps {
  dataset: any
  analysisResults: any[]
}

export function DataVisualization({ dataset, analysisResults }: DataVisualizationProps) {
  const [selectedChart, setSelectedChart] = useState('bar')
  const [selectedColumn, setSelectedColumn] = useState('')
  const [selectedXColumn, setSelectedXColumn] = useState('')

  // Get numeric and categorical columns using useMemo
  const numericColumns = useMemo(() => 
    dataset?.columnInfo?.filter((col: any) => col.type === 'number') || [], 
    [dataset?.columnInfo]
  )
  const categoricalColumns = useMemo(() => 
    dataset?.columnInfo?.filter((col: any) => col.type === 'text') || [], 
    [dataset?.columnInfo]
  )
  const dateColumns = useMemo(() => 
    dataset?.columnInfo?.filter((col: any) => col.type === 'date') || [], 
    [dataset?.columnInfo]
  )

  // Set default columns when dataset changes
  useEffect(() => {
    if (dataset?.columnInfo) {
      if (numericColumns.length > 0 && !selectedColumn) {
        setSelectedColumn(numericColumns[0].name)
      }
      if ((categoricalColumns.length > 0 || dateColumns.length > 0) && !selectedXColumn) {
        const xCol = categoricalColumns[0] || dateColumns[0]
        if (xCol) setSelectedXColumn(xCol.name)
      }
    }
  }, [dataset?.columnInfo, numericColumns, categoricalColumns, dateColumns, selectedColumn, selectedXColumn])

  // Generate chart data from actual dataset
  const generateChartData = () => {
    if (!dataset?.rows || !selectedColumn) return []

    if (selectedChart === 'pie') {
      // For pie chart, group by categorical column and sum numeric values
      const groupColumn = selectedXColumn || categoricalColumns[0]?.name
      if (!groupColumn) return []

      const grouped = dataset.rows.reduce((acc: any, row: any) => {
        const key = row[groupColumn] || 'Unknown'
        const value = parseFloat(row[selectedColumn]) || 0
        acc[key] = (acc[key] || 0) + value
        return acc
      }, {})

      const colors = ['#2563EB', '#7C3AED', '#059669', '#DC2626', '#F59E0B', '#EF4444', '#8B5CF6', '#10B981']
      return Object.entries(grouped).map(([name, value], index) => ({
        name,
        value: value as number,
        color: colors[index % colors.length]
      }))
    } else {
      // For bar/line charts
      if (!selectedXColumn) {
        // If no X column selected, create frequency distribution
        const values = dataset.rows.map((row: any) => parseFloat(row[selectedColumn])).filter(v => !isNaN(v))
        const sorted = values.sort((a, b) => a - b)
        const bins = 10
        const min = sorted[0]
        const max = sorted[sorted.length - 1]
        const binSize = (max - min) / bins

        const binData = []
        for (let i = 0; i < bins; i++) {
          const binStart = min + i * binSize
          const binEnd = min + (i + 1) * binSize
          const count = values.filter(v => v >= binStart && v < binEnd).length
          binData.push({
            name: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
            value: count
          })
        }
        return binData
      } else {
        // Group by X column and aggregate Y column
        const grouped = dataset.rows.reduce((acc: any, row: any) => {
          const key = row[selectedXColumn] || 'Unknown'
          const value = parseFloat(row[selectedColumn]) || 0
          if (!acc[key]) {
            acc[key] = { sum: 0, count: 0 }
          }
          acc[key].sum += value
          acc[key].count += 1
          return acc
        }, {})

        return Object.entries(grouped).map(([name, data]: [string, any]) => ({
          name,
          value: data.sum / data.count // Average
        })).slice(0, 20) // Limit to 20 items for readability
      }
    }
  }

  const chartData = generateChartData()

  // Sample data fallback for demo
  const sampleData = [
    { name: 'Jan', value: 400, sales: 240 },
    { name: 'Feb', value: 300, sales: 139 },
    { name: 'Mar', value: 200, sales: 980 },
    { name: 'Apr', value: 278, sales: 390 },
    { name: 'May', value: 189, sales: 480 },
    { name: 'Jun', value: 239, sales: 380 },
  ]

  const pieData = [
    { name: 'Category A', value: 400, color: '#2563EB' },
    { name: 'Category B', value: 300, color: '#7C3AED' },
    { name: 'Category C', value: 300, color: '#059669' },
    { name: 'Category D', value: 200, color: '#DC2626' },
  ]

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChartIcon },
    { value: 'pie', label: 'Pie Chart', icon: PieChartIcon },
  ]

  const renderChart = () => {
    const dataToUse = chartData.length > 0 ? chartData : sampleData
    const pieDataToUse = chartData.length > 0 ? chartData : pieData

    switch (selectedChart) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataToUse}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataToUse}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieDataToUse}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieDataToUse.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#2563EB'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  if (!dataset) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data to Visualize</h3>
            <p className="text-gray-600">Upload a dataset first to create visualizations</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Visualization</h2>
        <p className="text-gray-600">Create interactive charts and graphs from your data</p>
      </div>

      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Type
              </label>
              <Select value={selectedChart} onValueChange={setSelectedChart}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Y-Axis (Value)
              </label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select value column" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map((col: any, idx: number) => (
                    <SelectItem key={idx} value={col.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{col.name}</span>
                        <span className="text-xs text-gray-500">{col.type}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X-Axis (Category)
              </label>
              <Select value={selectedXColumn} onValueChange={setSelectedXColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category column" />
                </SelectTrigger>
                <SelectContent>
                  {[...categoricalColumns, ...dateColumns].map((col: any, idx: number) => (
                    <SelectItem key={idx} value={col.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{col.name}</span>
                        <span className="text-xs text-gray-500">{col.type}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Data Visualization</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {renderChart()}
          </div>
          <div className="text-sm text-gray-600">
            {chartData.length > 0 ? (
              <p>📊 Displaying data from your uploaded dataset. Select different columns to explore various aspects of your data.</p>
            ) : (
              <p>📊 Sample visualization shown. Upload data and select columns to see your actual data visualized.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Insights */}
      {analysisResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisResults.slice(-3).map((result, idx) => (
                <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">{result.suggestion}</p>
                  {result.dataset && (
                    <p className="text-xs text-blue-700 mt-1">Dataset: {result.dataset}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {dataset && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{dataset.rows}</p>
                <p className="text-sm text-gray-600">Total Rows</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{dataset.columns}</p>
                <p className="text-sm text-gray-600">Columns</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{(dataset.size / 1024).toFixed(1)}KB</p>
                <p className="text-sm text-gray-600">File Size</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}