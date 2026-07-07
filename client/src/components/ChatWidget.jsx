import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './ChatWidget.css';

const SOCKET_URL = 'http://localhost:5000';

export default function ChatWidget() {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (!open && msg.sender_type === 'admin') {
        setUnread((prev) => prev + 1);
      }
    });

    socketRef.current.on('conversation_created', ({ conversation: conv }) => {
      setConversation(conv);
      socketRef.current.emit('join_conversation', conv.id);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOpen = async () => {
    setOpen(true);
    setUnread(0);

    if (isAuthenticated && !conversation) {
      await loadConversation();
    } else if (!isAuthenticated && !conversation) {
      setShowGuestForm(true);
    }
  };

  const loadConversation = async () => {
    setLoading(true);
    try {
      const body = isAuthenticated ? {} : { guest_name: guestName, guest_email: guestEmail };
      const { data } = await api.post('/chat/conversations', body);
      setConversation(data.conversation);
      setMessages(data.messages || []);
      socketRef.current.emit('join_conversation', data.conversation.id);
      setShowGuestForm(false);
    } catch (err) {
      console.error('Load conversation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;
    await loadConversation();
  };

  const handleSend = () => {
    if (!newMsg.trim() || !conversation) return;

    socketRef.current.emit('send_message', {
      conversation_id: conversation.id,
      message: newMsg.trim(),
      sender_type: 'customer',
    });

    setNewMsg('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-widget">
      {/* Chat Panel */}
      {open && (
        <div className="chat-panel animate-fade-in-up">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-avatar">RC</div>
              <div>
                <h4>R. Canada Support</h4>
                <span className="chat-status">We typically reply in minutes</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <FiX />
            </button>
          </div>

          <div className="chat-messages">
            {/* Welcome message */}
            <div className="chat-msg admin">
              <div className="chat-bubble">
                Hi there! 👋 Welcome to R. Canada Furniture. How can we help you today?
              </div>
            </div>

            {showGuestForm ? (
              <div className="chat-guest-form">
                <p>Please introduce yourself so we can assist you better:</p>
                <form onSubmit={handleGuestSubmit}>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="form-input"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="form-input"
                    required
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    Start Chat
                  </button>
                </form>
              </div>
            ) : loading ? (
              <div className="chat-loading">
                <div className="spinner" style={{ width: 24, height: 24 }} />
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`chat-msg ${msg.sender_type}`}>
                  <div className="chat-bubble">{msg.message}</div>
                  <span className="chat-time">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {conversation && !showGuestForm && (
            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={handleKeyPress}
                className="chat-input"
              />
              <button
                className="chat-send-btn"
                onClick={handleSend}
                disabled={!newMsg.trim()}
                aria-label="Send message"
              >
                <FiSend />
              </button>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        className={`chat-fab ${open ? 'active' : ''}`}
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label="Chat with us"
      >
        {open ? <FiX /> : <FiMessageCircle />}
        {unread > 0 && !open && <span className="chat-unread-badge">{unread}</span>}
      </button>
    </div>
  );
}
