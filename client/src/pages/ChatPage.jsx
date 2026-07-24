import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import API from '../services/api';
import {
  MessageSquare,
  Send,
  Paperclip,
  Image as ImageIcon,
  Check,
  CheckCheck,
  User,
  Sparkles,
  BookOpen,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChatPage() {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch Conversations List
  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/chat/conversations');
      setConversations(data);
      if (data.length > 0 && !activePartner) {
        setActivePartner(data[0].partner);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Messages for Active Partner
  const fetchMessages = async (partnerId) => {
    try {
      const { data } = await API.get(`/chat/messages/${partnerId}`);
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activePartner) {
      fetchMessages(activePartner._id);
      if (socket) {
        socket.emit('join_chat', { currentUserId: user._id, partnerId: activePartner._id });
      }
    }
  }, [activePartner, socket]);

  // Socket Live Message & Typing Event Listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMsg) => {
      if (
        (newMsg.sender === activePartner?._id && newMsg.receiver === user._id) ||
        (newMsg.sender === user._id && newMsg.receiver === activePartner?._id)
      ) {
        setMessages((prev) => [...prev, newMsg]);
        scrollToBottom();
      }
      fetchConversations();
    };

    const handleUserTyping = ({ sender }) => {
      if (sender === activePartner?._id) {
        setIsPartnerTyping(true);
      }
    };

    const handleUserStopTyping = ({ sender }) => {
      if (sender === activePartner?._id) {
        setIsPartnerTyping(false);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, [socket, activePartner, user]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (!socket || !activePartner) return;

    socket.emit('typing', { sender: user._id, receiver: activePartner._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { sender: user._id, receiver: activePartner._id });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !attachmentUrl) || !activePartner) return;

    const msgPayload = {
      receiverId: activePartner._id,
      content: inputMessage,
      attachments: attachmentUrl ? [{ url: attachmentUrl, fileName: 'Attachment', fileType: 'image' }] : []
    };

    try {
      const { data } = await API.post('/chat/messages', msgPayload);

      // Emit via socket for real-time delivery
      if (socket) {
        socket.emit('send_message', {
          ...data,
          sender: user._id,
          receiver: activePartner._id
        });
      }

      setMessages((prev) => [...prev, data]);
      setInputMessage('');
      setAttachmentUrl('');
      setShowAttachmentModal(false);
      scrollToBottom();
      fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 h-[78vh] overflow-hidden">

        {/* Left Sidebar: Conversations List */}
        <div className="border-r border-slate-800 flex flex-col h-full bg-slate-950/40">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" /> Messaging Console
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length > 0 ? (
              conversations.map(({ partner, lastMessage, unreadCount }) => {
                const isActive = activePartner?._id === partner._id;
                return (
                  <button
                    key={partner._id}
                    onClick={() => setActivePartner(partner)}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between gap-3 text-left transition-all ${isActive
                        ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/30 border border-indigo-500/40'
                        : 'hover:bg-slate-900/60 border border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <img src={partner.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${partner.isOnline ? 'bg-emerald-500' : 'bg-slate-600'
                          }`} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{partner.name}</h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {lastMessage ? lastMessage.content || 'Sent attachment' : 'No messages yet'}
                        </p>
                      </div>
                    </div>

                    {unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center py-10">No active chat partners yet.</p>
            )}
          </div>
        </div>

        {/* Right Area: Active Chat Window */}
        {activePartner ? (
          <div className="md:col-span-2 flex flex-col h-full bg-slate-900/40">

            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between glass-panel">
              <div className="flex items-center gap-3">
                <img src={activePartner.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                <div>
                  <h4 className="font-extrabold text-sm text-white">{activePartner.name}</h4>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`w-2 h-2 rounded-full ${activePartner.isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    <span className="text-slate-400">{activePartner.isOnline ? 'Online Now' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/sessions"
                className="px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-900/60"
              >
                <BookOpen className="w-3.5 h-3.5" /> Session Tracker
              </Link>
            </div>

            {/* Messages Scroll Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => {
                const isMe = msg.sender === user._id || msg.sender?._id === user._id;
                return (
                  <div
                    key={msg._id || index}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${isMe
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/80'
                        }`}
                    >
                      {msg.content}

                      {/* Attachment preview if exists */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2">
                          <img
                            src={msg.attachments[0].url}
                            alt="Attachment"
                            className="rounded-xl max-h-48 object-cover border border-slate-700"
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isPartnerTyping && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 italic">
                  <span className="animate-pulse">{activePartner.name} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 glass-panel flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAttachmentModal(!showAttachmentModal)}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Attach image link"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder={`Type a message to ${activePartner.name}...`}
                className="flex-1 glass-input rounded-xl px-4 py-2.5 text-xs text-white"
              />

              <button
                type="submit"
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold hover:from-indigo-500 hover:to-violet-500 shadow-glow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="md:col-span-2 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
            Select a conversation partner on the left to start messaging.
          </div>
        )}

      </div>

      {/* Attachment Link Modal */}
      {showAttachmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel rounded-3xl max-w-sm w-full p-5 border border-slate-700">
            <h4 className="font-bold text-sm text-white mb-2">Attach Image URL</h4>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full glass-input rounded-xl px-3 py-2 text-xs mb-3"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAttachmentModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowAttachmentModal(false)}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white"
              >
                Attach Image
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
