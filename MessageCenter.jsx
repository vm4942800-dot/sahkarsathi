/**
 * Real-Time Communication & Message Center for SahkarSathi
 * Secure direct communication for active bookings and projects
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  Clock,
  User,
  Wrench,
  HardHat,
  Search,
  ArrowLeft,
  Check,
  CheckCheck,
  Info,
  Building,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';

export default function MessageCenter({ role = 'customer' }) {
  const { user, profile } = useAuth();
  const userId = user?.id || profile?.id || 'usr-cust-demo';
  const userName = profile?.fullName || (role === 'worker' ? 'Sunil Verma' : role === 'supervisor' ? 'Rajesh Mehta' : 'Priya Sharma');
  const userRole = profile?.role || role;

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const messagesEndRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoadingConversations(true);
      try {
        const convs = await messageService.getConversations(userId, userRole);
        if (isMounted) {
          setConversations(convs || []);
          if (convs && convs.length > 0 && !activeConvId) {
            setActiveConvId(convs[0].id);
          }
        }
      } catch (err) {
        console.warn('Failed to load conversations:', err.message);
      } finally {
        if (isMounted) setLoadingConversations(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [userId, userRole]);

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (!activeConvId) return;

    let isMounted = true;
    async function fetchMsgs() {
      setLoadingMessages(true);
      setErrorMessage('');
      try {
        const msgs = await messageService.getMessages(activeConvId);
        if (isMounted) {
          setMessages(msgs || []);
        }
      } catch (err) {
        if (isMounted) setErrorMessage(err.message);
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    }

    fetchMsgs();

    // Subscribe to real-time incoming messages for this conversation
    const unsubscribe = messageService.subscribeToConversation(
      activeConvId,
      (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [activeConvId]);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message send
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const content = inputText.trim();
    if (!content || !activeConvId || sending) return;

    setSending(true);
    setErrorMessage('');
    try {
      const sentMsg = await messageService.sendMessage({
        conversationId: activeConvId,
        senderId: userId,
        senderName: userName,
        senderRole: userRole,
        content,
      });

      setMessages((prev) => [...prev, sentMsg]);
      setInputText('');

      // Update conversation in sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, last_message: content, last_message_at: sentMsg.created_at }
            : c
        )
      );
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.service?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleBadge = (msgRole) => {
    switch (msgRole) {
      case 'worker':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 text-[10px] font-semibold border border-emerald-500/20">
            <Wrench className="w-2.5 h-2.5 text-emerald-600" />
            Worker
          </span>
        );
      case 'supervisor':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-800 text-[10px] font-semibold border border-amber-500/20">
            <HardHat className="w-2.5 h-2.5 text-amber-600" />
            Supervisor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-brand-teal/10 text-brand-teal text-[10px] font-semibold border border-brand-teal/20">
            <User className="w-2.5 h-2.5 text-brand-teal" />
            Customer
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[550px]">
      {/* Left Column: Conversation Directory */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-brand-border flex flex-col shrink-0 bg-brand-surface/30 ${
          activeConvId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Search & Header */}
        <div className="p-4 border-b border-brand-border bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-teal" />
              <h2 className="font-display font-bold text-base text-brand-primary">
                Messages
              </h2>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal font-semibold">
              {conversations.length} Active
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-brand-secondary absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job ID or service..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-brand-border bg-brand-surface/50 text-xs focus:outline-none focus:border-brand-teal text-brand-primary placeholder:text-brand-secondary/60"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-brand-border/60">
          {loadingConversations ? (
            <div className="p-8 text-center text-xs text-brand-secondary">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-teal" />
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-8 h-8 text-brand-secondary/50 mx-auto mb-2" />
              <p className="text-xs font-semibold text-brand-primary">No conversations found</p>
              <p className="text-[11px] text-brand-secondary mt-1">
                Direct messages become active when a booking or project is initiated.
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-all flex flex-col gap-1 relative ${
                    isActive
                      ? 'bg-white border-l-4 border-l-brand-teal shadow-xs'
                      : 'hover:bg-brand-surface/60 bg-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-brand-primary truncate">
                      {conv.title}
                    </span>
                    <span className="text-[10px] text-brand-secondary font-mono shrink-0">
                      {conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>

                  <p className="text-[11px] text-brand-secondary line-clamp-1">
                    {conv.last_message}
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand-surface text-brand-primary font-medium border border-brand-border/60">
                      {conv.service || 'Cooperative Service'}
                    </span>
                    {conv.unread_count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-brand-teal text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Active Conversation Messages */}
      <div
        className={`flex-1 flex flex-col bg-brand-bg/40 ${
          !activeConvId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-3.5 px-4 sm:px-6 bg-white border-b border-brand-border flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden p-1.5 rounded-lg text-brand-secondary hover:bg-brand-surface"
                  aria-label="Back to conversations list"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm sm:text-base text-brand-primary">
                      {activeConversation.title}
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[10px] font-medium">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Escrow Channel
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-secondary">
                    Participants: Customer, Verified Worker, Lead Field Supervisor
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[11px] text-brand-secondary bg-brand-surface px-3 py-1 rounded-xl border border-brand-border">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>End-to-End Logged</span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Security Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 flex items-start gap-2 max-w-xl mx-auto mb-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Cooperative Protection Rule:</strong> All communications, change orders, and material price confirmations are archived in this channel to validate escrow payout releases. Never pay offline cash outside the platform.
                </div>
              </div>

              {loadingMessages ? (
                <div className="py-12 text-center text-xs text-brand-secondary">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-teal" />
                  Loading conversation history...
                </div>
              ) : messages.length === 0 ? (
                <div className="py-16 text-center text-xs text-brand-secondary">
                  <MessageSquare className="w-8 h-8 text-brand-secondary/40 mx-auto mb-2" />
                  <p className="font-bold text-brand-primary">Start of discussion</p>
                  <p className="text-[11px] mt-1">Send a message to coordinate on-site arrival, tools, or building gate access.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === userId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[11px] font-bold text-brand-primary">
                          {isMe ? 'You' : msg.sender_name}
                        </span>
                        {getRoleBadge(msg.sender_role)}
                        <span className="text-[10px] text-brand-secondary/70 font-mono ml-1">
                          {formatMessageTime(msg.created_at)}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isMe
                            ? 'bg-brand-teal text-white rounded-tr-xs'
                            : 'bg-white text-brand-primary border border-brand-border rounded-tl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <div className="p-3 sm:p-4 bg-white border-t border-brand-border shrink-0">
              {errorMessage && (
                <div className="mb-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <textarea
                    rows={2}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type an update or instruction... (Press Enter to send, Shift+Enter for newline)"
                    className="w-full resize-none p-2.5 sm:p-3 text-xs rounded-xl border border-brand-border bg-brand-surface/40 focus:outline-none focus:border-brand-teal focus:bg-white text-brand-primary placeholder:text-brand-secondary/60 leading-relaxed"
                    maxLength={2000}
                  />
                  <span className="absolute right-2.5 bottom-2 text-[9px] text-brand-secondary/60 font-mono">
                    {inputText.length}/2000
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="h-10 px-4 sm:px-5 rounded-xl bg-brand-teal text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-brand-teal-light transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {sending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-brand-surface flex items-center justify-center mb-4 text-brand-secondary/50">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-base text-brand-primary">
              No Conversation Selected
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mt-1">
              Select an active booking or project conversation from the left to coordinate directly with your assigned worker and supervisor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
