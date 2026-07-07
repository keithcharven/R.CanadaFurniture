import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import { io } from 'socket.io-client';
import api from '../../services/api';

const SOCKET_URL = 'http://localhost:5000';

export default function AdminChatInbox() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('admin_join');

    socketRef.current.on('receive_message', (msg) => {
      if (selected && msg.conversation_id === selected.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socketRef.current.on('new_conversation', () => { loadConversations(); });
    socketRef.current.on('new_customer_message', () => { loadConversations(); });

    loadConversations();
    return () => { socketRef.current?.disconnect(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const { data } = await api.get('/chat/admin/conversations');
      setConversations(data.conversations || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const selectConversation = async (conv) => {
    setSelected(conv);
    socketRef.current.emit('join_conversation', conv.id);
    try {
      const { data } = await api.get(`/chat/conversations/${conv.id}/messages`);
      setMessages(data.messages || []);
    } catch(e) { console.error(e); }
  };

  const handleSend = () => {
    if (!newMsg.trim() || !selected) return;
    socketRef.current.emit('send_message', {
      conversation_id: selected.id,
      message: newMsg.trim(),
      sender_type: 'admin',
    });
    setNewMsg('');
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <h2>Chat Inbox</h2>
      <div style={{ display: 'flex', gap: 'var(--space-lg)', height: 'calc(100vh - var(--navbar-height) - 160px)', minHeight: 400 }}>
        {/* Conversation List */}
        <div style={{ width: 300, background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'auto', flexShrink: 0 }}>
          {conversations.length === 0 ? (
            <div className="admin-empty"><p>No conversations</p></div>
          ) : conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv)}
              style={{
                padding: '0.85rem 1rem',
                borderBottom: '1px solid var(--color-gray-200)',
                cursor: 'pointer',
                background: selected?.id === conv.id ? 'var(--color-pink-50)' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-charcoal)' }}>
                {conv.user?.full_name || conv.guest_name || 'Guest'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                {conv.user?.email || conv.guest_email || ''}
              </div>
              {conv.messages?.[0] && (
                <div style={{ fontSize: '0.78rem', color: 'var(--color-gray-400)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.messages[0].message}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
          {!selected ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-400)' }}>
              Select a conversation to start replying
            </div>
          ) : (
            <>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)', fontWeight: 600 }}>
                {selected.user?.full_name || selected.guest_name || 'Guest'}
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginLeft: '0.5rem' }}>
                  {selected.user?.email || selected.guest_email}
                </span>
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--color-gray-100)' }}>
                {messages.map((msg) => (
                  <div key={msg.id} style={{ alignSelf: msg.sender_type === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: '12px',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      background: msg.sender_type === 'admin' ? 'var(--color-pink-500)' : 'var(--color-white)',
                      color: msg.sender_type === 'admin' ? 'white' : 'var(--color-charcoal)',
                      boxShadow: msg.sender_type === 'customer' ? 'var(--shadow-sm)' : 'none',
                    }}>
                      {msg.message}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-gray-400)', marginTop: 2, textAlign: msg.sender_type === 'admin' ? 'right' : 'left' }}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid var(--color-gray-200)' }}>
                <input
                  type="text"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a reply..."
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={!newMsg.trim()}>
                  <FiSend />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
