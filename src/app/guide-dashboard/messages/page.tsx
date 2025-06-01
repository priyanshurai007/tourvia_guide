'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  FaSearch, 
  FaEllipsisV, 
  FaPaperPlane, 
  FaPaperclip, 
  FaSmile, 
  FaPhoneAlt, 
  FaVideo,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCircle
} from 'react-icons/fa';
import DateDisplay from '@/components/DateDisplay';
import { formatDate, formatDateTime } from '@/utils/dateFormatters';

// Sample chat data
const chats = [
  {
    id: 'C001',
    contact: {
      id: 'U001',
      name: 'Rahul Sharma',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      lastSeen: '2024-04-26T14:32:00',
      isOnline: true
    },
    lastMessage: {
      text: 'Hi, looking forward to our tour! Can we meet 10 minutes early?',
      time: '2024-04-26T14:32:00',
      isRead: false,
      senderId: 'U001'
    },
    unreadCount: 1,
    booking: {
      id: 'B001',
      tourName: 'Old Delhi Heritage Tour',
      date: '2024-05-15',
      time: '09:00'
    }
  },
  {
    id: 'C002',
    contact: {
      id: 'U002',
      name: 'Aditya Patel',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      lastSeen: '2024-04-26T12:15:00',
      isOnline: false
    },
    lastMessage: {
      text: 'Thanks for the tour recommendations! I\'ll be bringing my DSLR camera.',
      time: '2024-04-26T12:15:00',
      isRead: true,
      senderId: 'U002'
    },
    unreadCount: 0,
    booking: {
      id: 'B002',
      tourName: 'Mumbai Heritage Walk',
      date: '2024-05-20',
      time: '10:00'
    }
  },
  {
    id: 'C003',
    contact: {
      id: 'U003',
      name: 'Priya Kapoor',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      lastSeen: '2024-04-26T10:45:00',
      isOnline: false
    },
    lastMessage: {
      text: 'Is the tour still on if it rains tomorrow?',
      time: '2024-04-26T10:45:00',
      isRead: true,
      senderId: 'U003'
    },
    unreadCount: 0,
    booking: {
      id: 'B003',
      tourName: 'Cultural Food Tour',
      date: '2024-05-25',
      time: '18:00'
    }
  },
  {
    id: 'C004',
    contact: {
      id: 'U004',
      name: 'Vikash Gupta',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      lastSeen: '2024-04-25T18:22:00',
      isOnline: false
    },
    lastMessage: {
      text: 'We had a great time on your tour! Thanks for all the historical insights.',
      time: '2024-04-25T18:22:00',
      isRead: true,
      senderId: 'U004'
    },
    unreadCount: 0,
    booking: {
      id: 'B004',
      tourName: 'Old Delhi Heritage Tour',
      date: '2024-04-22',
      time: '09:00'
    }
  },
  {
    id: 'C005',
    contact: {
      id: 'U005',
      name: 'Meera Shah',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      lastSeen: '2024-04-25T14:10:00',
      isOnline: true
    },
    lastMessage: {
      text: 'Just left you a 5-star review. You made our trip to Delhi so much more enjoyable!',
      time: '2024-04-25T14:10:00',
      isRead: true,
      senderId: 'U005'
    },
    unreadCount: 0,
    booking: {
      id: 'B005',
      tourName: 'City Highlights Tour',
      date: '2024-04-28',
      time: '10:00'
    }
  }
];

// Sample conversation data
const mockConversation = [
  {
    id: 'M001',
    text: 'Hello! I\'m interested in your Old Delhi Heritage Tour.',
    time: '2024-04-25T10:15:00',
    senderId: 'U001',
    isRead: true
  },
  {
    id: 'M002',
    text: 'Hi Rahul! Thank you for your interest. The Old Delhi Heritage Tour is one of our most popular options. Is there anything specific you\'d like to know about it?',
    time: '2024-04-25T10:20:00',
    senderId: 'G001', // Guide ID
    isRead: true
  },
  {
    id: 'M003',
    text: 'Yes, I\'m planning to come with my wife. What are the best photo spots on this tour?',
    time: '2024-04-25T10:25:00',
    senderId: 'U001',
    isRead: true
  },
  {
    id: 'M004',
    text: 'Great choice! For photography, the tour includes some amazing spots. We\'ll visit Jama Masjid with its stunning architecture, Chandni Chowk\'s vibrant market lanes, and the Red Fort which offers beautiful photo opportunities - especially near sunrise or sunset.',
    time: '2024-04-25T10:30:00',
    senderId: 'G001',
    isRead: true
  },
  {
    id: 'M005',
    text: 'That sounds perfect! I just booked the tour for May 15th.',
    time: '2024-04-26T09:45:00',
    senderId: 'U001',
    isRead: true
  },
  {
    id: 'M006',
    text: 'Excellent! I\'ve received your booking. Looking forward to showing you and your wife around Old Delhi. If you have any questions before the tour, feel free to ask.',
    time: '2024-04-26T10:00:00',
    senderId: 'G001',
    isRead: true
  },
  {
    id: 'M007',
    text: 'Hi, looking forward to our tour! Can we meet 10 minutes early?',
    time: '2024-04-26T14:32:00',
    senderId: 'U001',
    isRead: false
  }
];

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState(mockConversation);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [formattedTimes, setFormattedTimes] = useState<Record<string, string>>({});
  const [formattedLastSeen, setFormattedLastSeen] = useState<string>('');
  
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);
  
  useEffect(() => {
    // Format times after component mounts on client side
    const times: Record<string, string> = {};
    chats.forEach(chat => {
      const date = new Date(chat.lastMessage.time);
      times[chat.lastMessage.time] = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    setFormattedTimes(times);
    
    // Format last seen time
    if (selectedChat?.contact?.lastSeen) {
      const lastSeenDate = new Date(selectedChat.contact.lastSeen);
      const now = new Date();
      const diffMs = now.getTime() - lastSeenDate.getTime();
      const diffMins = Math.round(diffMs / 60000);
      
      let lastSeenText = '';
      if (diffMins < 1) {
        lastSeenText = 'Just now';
      } else if (diffMins < 60) {
        lastSeenText = `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
      } else if (diffMins < 1440) { // less than a day
        const hours = Math.floor(diffMins / 60);
        lastSeenText = `${hours} hour${hours === 1 ? '' : 's'} ago`;
      } else {
        const formattedDate = formatDate(selectedChat.contact.lastSeen);
        const formattedTime = lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastSeenText = `${formattedDate} at ${formattedTime}`;
      }
      setFormattedLastSeen(lastSeenText);
    }
  }, [chats, selectedChat]);
  
  const filteredChats = chats.filter(chat => 
    chat.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.booking.tourName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatTime = (timeString: string) => {
    return formattedTimes[timeString] || '';
  };
  
  const formatLastSeen = () => {
    return formattedLastSeen;
  };
  
  const sendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: `M${conversation.length + 1}`,
      text: message,
      time: new Date().toISOString(),
      senderId: 'G001', // Guide ID
      isRead: false
    };
    
    setConversation([...conversation, newMessage]);
    setMessage('');
  };
  
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-160px)]">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 mt-1">Communicate with your customers</p>
      </div>
      
      <div className="flex flex-1 bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden flex-col md:flex-row">
        {/* Chat List - Hidden on mobile, shown on tablet/desktop */}
        <div className="hidden md:flex md:w-80 lg:w-96 flex-col border-r border-gray-700 max-h-[calc(100vh-220px)] md:max-h-none">
          <div className="p-3 md:p-4 border-b border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div 
                key={chat.id}
                className={`p-3 cursor-pointer hover:bg-gray-700 transition ${selectedChat.id === chat.id ? 'bg-gray-700' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-start">
                  <div className="relative">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 border border-gray-600">
                      <Image 
                        src={chat.contact.image} 
                        alt={chat.contact.name} 
                        fill 
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    {chat.contact.isOnline && (
                      <div className="absolute bottom-0 right-3 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-white truncate">{chat.contact.name}</h3>
                      <span className="text-xs text-gray-400">{formatTime(chat.lastMessage.time)}</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{chat.lastMessage.text}</p>
                    <div className="mt-1 text-xs text-gray-500 truncate">
                      {chat.booking.tourName}
                    </div>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="ml-2 bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Chat Area - Flex column to support mobile view */}
        <div className="flex-1 flex flex-col max-h-[calc(100vh-220px)] md:max-h-none">
          {/* Mobile chat selection - Improved selector */}
          <div className="md:hidden p-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center">
              <select 
                className="w-full p-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                onChange={(e) => {
                  const selected = chats.find(chat => chat.id === e.target.value);
                  if (selected) setSelectedChat(selected);
                }}
                value={selectedChat.id}
              >
                {chats.map(chat => (
                  <option key={chat.id} value={chat.id}>
                    {chat.contact.name} - {chat.booking.tourName}
                  </option>
                ))}
              </select>
              
              {/* Mobile toggle for showing chats list */}
              <button 
                className="md:hidden ml-2 p-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
                onClick={() => {
                  // Toggle mobile chat list visibility
                  const chatList = document.getElementById('mobile-chat-list');
                  if (chatList) {
                    chatList.classList.toggle('hidden');
                  }
                }}
              >
                <FaSearch size={16} />
              </button>
            </div>
            
            {/* Mobile chat list (hidden by default, shown when toggled) */}
            <div id="mobile-chat-list" className="hidden mt-3 bg-gray-800 absolute left-0 right-0 z-10 rounded-b-lg shadow-lg border border-gray-700 max-h-64 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div 
                  key={chat.id}
                  className={`p-3 cursor-pointer hover:bg-gray-700 transition ${selectedChat.id === chat.id ? 'bg-gray-700' : ''}`}
                  onClick={() => {
                    setSelectedChat(chat);
                    // Hide the list after selection
                    const chatList = document.getElementById('mobile-chat-list');
                    if (chatList) {
                      chatList.classList.add('hidden');
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 border border-gray-600">
                      <Image 
                        src={chat.contact.image} 
                        alt={chat.contact.name} 
                        fill 
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{chat.contact.name}</h3>
                      <p className="text-xs text-gray-400 truncate">{chat.booking.tourName}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="ml-2 bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat header - Improved for mobile */}
          <div className="p-3 md:p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden mr-2 md:mr-3 border border-gray-600">
                  <Image 
                    src={selectedChat.contact.image} 
                    alt={selectedChat.contact.name}
                    fill 
                    sizes="(max-width: 768px) 32px, 40px"
                    className="object-cover"
                    priority
                  />
                </div>
                {selectedChat.contact.isOnline && (
                  <div className="absolute bottom-0 right-2 md:right-3 w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-green-500 border-2 border-gray-800"></div>
                )}
              </div>
              <div className="truncate">
                <h3 className="font-medium text-white flex items-center text-sm md:text-base">
                  {selectedChat.contact.name}
                  {selectedChat.contact.isOnline ? (
                    <span className="ml-2 flex items-center text-xs text-green-400 hidden md:flex">
                      <FaCircle className="mr-1" size={8} />
                      Online
                    </span>
                  ) : (
                    <span className="ml-2 text-xs text-gray-400 hidden md:inline">
                      Last seen {formatLastSeen()}
                    </span>
                  )}
                </h3>
                <div className="text-xs text-gray-400 truncate">
                  {selectedChat.booking.tourName} • <DateDisplay date={selectedChat.booking.date} className="text-xs" /> at {selectedChat.booking.time}
                </div>
              </div>
            </div>
            
            {/* Toggle customer info on mobile/tablet */}
            <div className="flex space-x-1 md:space-x-3">
              <button className="p-1 md:p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition hidden sm:block">
                <FaPhoneAlt size={14} className="md:w-4 md:h-4" />
              </button>
              <button className="p-1 md:p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition hidden sm:block">
                <FaVideo size={14} className="md:w-4 md:h-4" />
              </button>
              <button 
                className="p-1 md:p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition lg:hidden"
                onClick={() => {
                  // Toggle customer info panel
                  const customerInfo = document.getElementById('customer-info-panel');
                  if (customerInfo) {
                    customerInfo.classList.toggle('hidden');
                  }
                }}
              >
                <FaUser size={14} className="md:w-4 md:h-4" />
              </button>
              <button className="p-1 md:p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition">
                <FaEllipsisV size={14} className="md:w-4 md:h-4" />
              </button>
            </div>
          </div>
          
          {/* Messages - Improved scrolling */}
          <div className="flex-1 p-3 md:p-4 overflow-y-auto bg-gray-800 bg-opacity-50">
            <div className="space-y-3 md:space-y-4">
              {conversation.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.senderId === 'G001' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.senderId !== 'G001' && (
                    <div className="relative w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden mr-2 self-end">
                      <Image 
                        src={selectedChat.contact.image} 
                        alt={selectedChat.contact.name}
                        fill 
                        sizes="(max-width: 768px) 24px, 32px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div 
                    className={`max-w-[75%] sm:max-w-[70%] rounded-lg px-3 py-2 md:px-4 md:py-2 ${
                      msg.senderId === 'G001' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    <p className="text-sm md:text-base">{msg.text}</p>
                    <div className={`text-xs mt-1 flex justify-end ${
                      msg.senderId === 'G001' ? 'text-orange-200' : 'text-gray-400'
                    }`}>
                      {formatTime(msg.time)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          </div>
          
          {/* Message input - Improved for mobile */}
          <div className="p-2 md:p-3 border-t border-gray-700 bg-gray-800">
            <div className="flex items-center">
              <button className="p-1 md:p-2 text-gray-400 hover:text-gray-200 transition mr-1">
                <FaPaperclip size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full pl-3 pr-8 py-1.5 md:pl-4 md:pr-10 md:py-2 rounded-full bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm md:text-base"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
                <button className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition">
                  <FaSmile size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
              </div>
              <button 
                className={`p-1.5 md:p-2 ml-1 md:ml-2 text-white rounded-full transition ${
                  message.trim() === '' 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
                onClick={sendMessage}
                disabled={message.trim() === ''}
              >
                <FaPaperPlane size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Customer Info - Modified to be toggleable on mobile/tablet */}
        <div id="customer-info-panel" className="hidden lg:block w-72 lg:w-80 border-l border-gray-700 p-3 md:p-4 bg-gray-800 overflow-y-auto max-h-[calc(100vh-220px)] md:max-h-none">
          <div className="text-center mb-4 md:mb-6">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-orange-500">
              <Image 
                src={selectedChat.contact.image} 
                alt={selectedChat.contact.name}
                fill 
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover"
              />
            </div>
            <h3 className="text-lg md:text-xl font-medium text-white">{selectedChat.contact.name}</h3>
            <p className="text-sm text-gray-400">
              {selectedChat.contact.isOnline ? 'Online' : `Last seen ${formatLastSeen()}`}
            </p>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-white mb-3">Booking Details</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaCalendarAlt className="text-orange-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-white">
                    <DateDisplay date={selectedChat.booking.date} className="text-sm" /> at {selectedChat.booking.time}
                  </p>
                  <p className="text-xs text-gray-400">{selectedChat.booking.tourName}</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-orange-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-white">Meeting Point</p>
                  <p className="text-xs text-gray-400">Jama Masjid Gate No. 3, Old Delhi</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaUser className="text-orange-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-white">Customer Details</p>
                  <p className="text-xs text-gray-400">{selectedChat.contact.name}</p>
                  <p className="text-xs text-gray-400">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-4 pt-4">
            <h4 className="text-sm font-medium text-white mb-3">Quick Responses</h4>
            <div className="space-y-2">
              <button 
                className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition"
                onClick={() => setMessage("Yes, we're still on schedule for the tour. Looking forward to it!")}
              >
                Confirm Tour
              </button>
              <button 
                className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition"
                onClick={() => setMessage("Thanks for your message. I'll be in touch with you soon.")}
              >
                Acknowledge
              </button>
              <button 
                className="w-full text-left px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition"
                onClick={() => setMessage("Please arrive 10 minutes before the scheduled time.")}
              >
                Arrival Time
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 