'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Settings, Plus, ChevronDown } from "lucide-react"

export function ChatInterface() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <Button variant="outline" className="mb-4 text-white border-gray-700">
          <Plus className="mr-2 h-4 w-4" /> New chat
        </Button>
        <div className="flex-grow overflow-auto">
          {/* Chat history would go here */}
        </div>
        <div className="mt-auto">
          <Button variant="ghost" className="w-full justify-start text-gray-300">
            <MessageCircle className="mr-2 h-4 w-4" />
            ChatGPT
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <div className="text-2xl text-gray-600">Hi, how can I help you today?</div>
        </div>
        <div className="p-4 border-t">
          <div className="relative">
            <Input
              className="w-full pr-10 rounded-lg border-gray-300"
              placeholder="Message ChatGPT"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}