import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Send, Bot, User, BarChart3 } from 'lucide-react'
import { blink } from '@/blink/client'

interface ChatInterfaceProps {
  currentDataset: any
  onAnalysisResult: (result: any) => void
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  analysis?: any
}

export function ChatInterface({ currentDataset, onAnalysisResult }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Data Analyst. Upload a dataset and I\'ll help you analyze it. You can ask me questions like:\n\n• "Show me summary statistics"\n• "What are the trends in this data?"\n• "Find correlations between variables"\n• "Create a chart for sales by month"',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      let prompt = inputValue

      if (currentDataset) {
        prompt = `I have a dataset called "${currentDataset.name}" with ${currentDataset.rows} rows and ${currentDataset.columns} columns. The columns are: ${currentDataset.columnInfo?.map((col: any) => col.name).join(', ')}. 

User question: ${inputValue}

Please provide a helpful analysis response. If the user is asking for a chart or visualization, describe what type of chart would be appropriate and what data should be displayed.`
      } else {
        prompt = `The user hasn't uploaded a dataset yet. Please remind them to upload data first and suggest what they can do once they have data uploaded. User message: ${inputValue}`
      }

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 500
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: text,
        timestamp: new Date()
      }

      // If the response mentions creating a chart or visualization, add analysis metadata
      if (text.toLowerCase().includes('chart') || text.toLowerCase().includes('graph') || text.toLowerCase().includes('visualization')) {
        assistantMessage.analysis = {
          type: 'visualization',
          suggestion: text,
          dataset: currentDataset?.name
        }
        onAnalysisResult(assistantMessage.analysis)
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    "Show me summary statistics",
    "What are the main trends?",
    "Find correlations between variables",
    "Create a bar chart",
    "Identify outliers in the data"
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium">AI Data Analyst</h3>
        </div>
        {currentDataset && (
          <div className="text-sm text-gray-600">
            Analyzing: {currentDataset.name}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className={`flex-1 max-w-[80%] ${
                message.type === 'user' ? 'text-right' : ''
              }`}>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.analysis && (
                    <div className="mt-2 p-2 bg-white/10 rounded border">
                      <div className="flex items-center space-x-2 text-sm">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analysis suggestion generated</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="p-3 rounded-lg bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing your data...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-3">
        {!currentDataset && (
          <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
            💡 Upload a dataset first to start analyzing your data!
          </div>
        )}
        
        {currentDataset && messages.length <= 1 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentDataset ? "Ask me about your data..." : "Upload data first to start chatting"}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}