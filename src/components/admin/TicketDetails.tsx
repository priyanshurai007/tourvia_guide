'use client';

import { useState, useRef, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import {
  PaperAirplaneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface TicketDetailsProps {
  ticket: any;
  onClose: () => void;
}

export default function TicketDetails({ ticket, onClose }: TicketDetailsProps) {
  const [newMessage, setNewMessage] = useState('');
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "I'm having trouble with my booking confirmation. Can you help me?",
      sender: 'customer',
      timestamp: ticket.createdAt
    },
    {
      id: 2,
      content: "Of course! I'll help you with your booking confirmation. Could you please provide your booking reference number?",
      sender: 'admin',
      timestamp: new Date().toISOString()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Create a new message
    const message = {
      id: Date.now(),
      content: newMessage,
      sender: 'admin',
      timestamp: new Date().toISOString(),
    };

    // Update the messages state
    setMessages(prevMessages => [...prevMessages, message]);
    
    // Clear the input
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    // Handle status update with API call
  };

  const handlePriorityChange = (newPriority: string) => {
    setPriority(newPriority);
    // Handle priority update with API call
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Ticket Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Ticket Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-white">{ticket.subject}</h2>
            <div className="flex items-center mt-2 space-x-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                status === 'open'
                  ? 'bg-red-100 text-red-800'
                  : status === 'in_progress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {status}
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                priority === 'high'
                  ? 'bg-red-100 text-red-800'
                  : priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {priority}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <img
              src={ticket.customer.avatar}
              alt=""
              className="h-10 w-10 rounded-full"
            />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-white">{ticket.customer.name}</h3>
              <p className="text-sm text-gray-400">{ticket.customer.email}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Messages</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto p-2">
            {messages.map(message => (
              <div key={message.id} className="flex items-start space-x-3">
                {message.sender === 'customer' ? (
                  <img
                    src={ticket.customer.avatar}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className={`${message.sender === 'admin' ? 'bg-orange-600' : 'bg-gray-700'} rounded-lg p-3`}>
                    <p className="text-sm text-white">
                      {message.content}
                    </p>
                    <p className={`text-xs ${message.sender === 'admin' ? 'text-orange-200' : 'text-gray-400'} mt-1`}>
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* New Message */}
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-24"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 self-end"
            disabled={!newMessage.trim()}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Modal>
  );
} 