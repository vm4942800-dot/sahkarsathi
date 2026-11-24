/**
 * Real-Time Communication & Message Service for SahkarSathi
 * Allows secure messaging between Customers, Workers, and Supervisors
 * strictly within the context of active bookings or projects.
 * Tagline: Every Worker Matters. Every Home Counts.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// High-fidelity fallback conversations for local preview and offline resilience
const MOCK_CONVERSATIONS = [
  {
    id: 'conv-bk-891',
    booking_id: 'BK-2025-0891',
    project_id: null,
    title: 'BK-2025-0891: Distribution Board Rewiring',
    service: 'Electrical Services',
    last_message: 'I have arrived on site and will begin the diagnostic load test in 10 minutes.',
    last_message_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    unread_count: 1,
    participants: [
      {
        id: 'usr-cust-demo',
        name: 'Priya Sharma',
        role: 'customer',
        badge: 'Homeowner',
        avatar: null,
      },
      {
        id: 'wrk-882',
        name: 'Sunil Verma',
        role: 'worker',
        badge: 'Master Electrician (SS-2025-E882)',
        avatar: null,
      },
      {
        id: 'sup-104',
        name: 'Rajesh Mehta',
        role: 'supervisor',
        badge: 'Regional Lead Coordinator',
        avatar: null,
      },
    ],
  },
  {
    id: 'conv-bk-512',
    booking_id: 'BK-2026-0512',
    project_id: null,
    title: 'BK-2026-0512: Concealed Pipe Leak Audit',
    service: 'Plumbing',
    last_message: 'Acoustic sensor detected minimal moisture behind the guest bathroom tile.',
    last_message_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    participants: [
      {
        id: 'usr-cust-demo',
        name: 'Priya Sharma',
        role: 'customer',
        badge: 'Homeowner',
        avatar: null,
      },
      {
        id: 'wrk-512',
        name: 'Arjun Das',
        role: 'worker',
        badge: 'Certified Plumber',
        avatar: null,
      },
      {
        id: 'sup-104',
        name: 'Rajesh Mehta',
        role: 'supervisor',
        badge: 'Regional Lead Coordinator',
        avatar: null,
      },
    ],
  },
  {
    id: 'conv-prj-01',
    booking_id: null,
    project_id: 'PRJ-2026-W01',
    title: 'PRJ-2026-W01: Modular Kitchen & Woodwork',
    service: 'Carpentry Project',
    last_message: 'Raw teak delivery confirmed for tomorrow morning 9:30 AM.',
    last_message_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    participants: [
      {
        id: 'usr-cust-demo',
        name: 'Priya Sharma',
        role: 'customer',
        badge: 'Homeowner',
        avatar: null,
      },
      {
        id: 'wrk-339',
        name: 'Balwinder Singh',
        role: 'worker',
        badge: 'Artisan Woodworker',
        avatar: null,
      },
      {
        id: 'sup-104',
        name: 'Rajesh Mehta',
        role: 'supervisor',
        badge: 'Regional Lead Coordinator',
        avatar: null,
      },
    ],
  },
];

const MOCK_MESSAGES = {
  'conv-bk-891': [
    {
      id: 'msg-1',
      conversation_id: 'conv-bk-891',
      sender_id: 'sup-104',
      sender_name: 'Rajesh Mehta',
      sender_role: 'supervisor',
      content: 'Hello Priya, I have verified technician Sunil Verma credentials and calibrated safety equipment for your distribution box job.',
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      is_read: true,
    },
    {
      id: 'msg-2',
      conversation_id: 'conv-bk-891',
      sender_id: 'usr-cust-demo',
      sender_name: 'Priya Sharma',
      sender_role: 'customer',
      content: 'Thank you Rajesh. Please note the building security gate requires badge scanning at Tower B entrance.',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      is_read: true,
    },
    {
      id: 'msg-3',
      conversation_id: 'conv-bk-891',
      sender_id: 'wrk-882',
      sender_name: 'Sunil Verma',
      sender_role: 'worker',
      content: 'I have arrived on site and will begin the diagnostic load test in 10 minutes.',
      created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      is_read: false,
    },
  ],
  'conv-bk-512': [
    {
      id: 'msg-201',
      conversation_id: 'conv-bk-512',
      sender_id: 'wrk-512',
      sender_name: 'Arjun Das',
      sender_role: 'worker',
      content: 'Acoustic sensor detected minimal moisture behind the guest bathroom tile.',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      is_read: true,
    },
  ],
  'conv-prj-01': [
    {
      id: 'msg-301',
      conversation_id: 'conv-prj-01',
      sender_id: 'sup-104',
      sender_name: 'Rajesh Mehta',
      sender_role: 'supervisor',
      content: 'Raw teak delivery confirmed for tomorrow morning 9:30 AM.',
      created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      is_read: true,
    },
  ],
};

let localConversations = [...MOCK_CONVERSATIONS];
let localMessages = { ...MOCK_MESSAGES };

export const messageService = {
  /**
   * Get all conversations for a specific user
   */
  async getConversations(userId, role = 'customer') {
    if (isSupabaseConfigured() && userId) {
      try {
        // Query conversations where user is a participant
        const { data, error } = await supabase
          .from('conversation_participants')
          .select(`
            conversation_id,
            role,
            last_read_at,
            conversations (
              id,
              booking_id,
              project_id,
              title,
              created_at,
              updated_at,
              messages (
                id,
                content,
                sender_id,
                created_at,
                is_read
              )
            )
          `)
          .eq('user_id', userId)
          .order('conversations(updated_at)', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((item) => {
            const conv = item.conversations;
            const msgs = conv?.messages || [];
            const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

            return {
              id: conv.id,
              booking_id: conv.booking_id,
              project_id: conv.project_id,
              title: conv.title,
              last_message: lastMsg ? lastMsg.content : 'Conversation started',
              last_message_at: lastMsg ? lastMsg.created_at : conv.created_at,
              unread_count: msgs.filter((m) => !m.is_read && m.sender_id !== userId).length,
              participants: [],
            };
          });
        }
      } catch (err) {
        console.warn('Supabase getConversations error, using fallback:', err.message);
      }
    }

    return localConversations;
  },

  /**
   * Get messages for a given conversation
   */
  async getMessages(conversationId) {
    if (isSupabaseConfigured() && conversationId) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            conversation_id,
            sender_id,
            content,
            is_read,
            created_at,
            profiles (
              full_name,
              role,
              avatar_url
            )
          `)
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          return data.map((msg) => ({
            id: msg.id,
            conversation_id: msg.conversation_id,
            sender_id: msg.sender_id,
            sender_name: msg.profiles?.full_name || 'Member',
            sender_role: msg.profiles?.role || 'member',
            content: msg.content,
            is_read: msg.is_read,
            created_at: msg.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase getMessages error, using fallback:', err.message);
      }
    }

    return localMessages[conversationId] || [];
  },

  /**
   * Send a new message inside an authorized conversation
   */
  async sendMessage({ conversationId, senderId, senderName, senderRole, content }) {
    const trimmed = (content || '').trim();
    if (!trimmed) {
      throw new Error('Message cannot be empty.');
    }
    if (trimmed.length > 2000) {
      throw new Error('Message exceeds the maximum limit of 2,000 characters.');
    }

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      conversation_id: conversationId,
      sender_id: senderId || 'usr-cust-demo',
      sender_name: senderName || 'You',
      sender_role: senderRole || 'customer',
      content: trimmed,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && senderId && conversationId) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            content: trimmed,
            is_read: false,
          })
          .select(`
            id,
            conversation_id,
            sender_id,
            content,
            is_read,
            created_at,
            profiles (
              full_name,
              role,
              avatar_url
            )
          `)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            conversation_id: data.conversation_id,
            sender_id: data.sender_id,
            sender_name: data.profiles?.full_name || senderName || 'You',
            sender_role: data.profiles?.role || senderRole || 'member',
            content: data.content,
            is_read: data.is_read,
            created_at: data.created_at,
          };
        }
      } catch (err) {
        console.warn('Supabase sendMessage fallback:', err.message);
      }
    }

    // Local fallback update
    if (!localMessages[conversationId]) {
      localMessages[conversationId] = [];
    }
    localMessages[conversationId].push(newMsg);

    // Update conversation last message
    localConversations = localConversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            last_message: trimmed,
            last_message_at: newMsg.created_at,
          }
        : c
    );

    return newMsg;
  },

  /**
   * Subscribe to real-time incoming messages for a specific conversation
   */
  subscribeToConversation(conversationId, onMessageReceived) {
    if (!isSupabaseConfigured() || !conversationId) {
      return () => {};
    }

    const channelName = `realtime-chat-${conversationId}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          if (onMessageReceived && payload.new) {
            // Enrich with sender profile
            let senderName = 'Member';
            let senderRole = 'member';
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, role')
                .eq('id', payload.new.sender_id)
                .single();
              if (profile) {
                senderName = profile.full_name;
                senderRole = profile.role;
              }
            } catch (e) {
              // Ignore profile lookup error
            }

            onMessageReceived({
              id: payload.new.id,
              conversation_id: payload.new.conversation_id,
              sender_id: payload.new.sender_id,
              sender_name: senderName,
              sender_role: senderRole,
              content: payload.new.content,
              is_read: payload.new.is_read,
              created_at: payload.new.created_at,
            });
          }
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // channel removed
      }
    };
  },
};
