import { useEffect, useMemo, useRef, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ChatContainer from './chat/ChatContainer';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import chatApi from '../../api/chatApi';
import { getEcho } from '../../lib/echo';

const ChatTab = () => {
  const { t } = useProfileLanguage();

  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [trainerAvatar, setTrainerAvatar] = useState(null);
  const [trainerOnline, setTrainerOnline] = useState(false);
  const [trainerTyping, setTrainerTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const subscribedConversationRef = useRef(null);

  const normalizeMessage = (message) => {
    if (!message) return message;

    const sender =
      message.sender ||
      (message.sender_type === 'admin' ? 'trainer' : message.sender_type === 'trainee' ? 'user' : undefined);

    const type = message.type || message.message_type || 'text';

    const fileUrl =
      message.file_url ||
      message.fileUrl ||
      message.thumbnail_url ||
      message.thumbnailUrl ||
      null;

    const status =
      message.status ||
      (message.is_read ? 'read' : 'sent');

    return {
      ...message,
      sender,
      type,
      file_url: message.file_url || message.fileUrl || null,
      thumbnail_url: message.thumbnail_url || message.thumbnailUrl || null,
      status,
      timestamp:
        message.timestamp ||
        (message.created_at
          ? new Date(message.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
          : null),
      created_at: message.created_at || new Date().toISOString(),
      file_name: message.file_name || message.fileName || null,
      file_size: message.file_size || null,
      file_type: message.file_type || type,
      _hasRenderableFile: !!fileUrl,
    };
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return aTime - bTime;
    });
  }, [messages]);

  const upsertMessage = (incomingMessage) => {
    const normalized = normalizeMessage(incomingMessage);

    setMessages((prev) => {
      const exists = prev.some((m) => Number(m.id) === Number(normalized.id));
      if (exists) {
        return prev.map((m) => (Number(m.id) === Number(normalized.id) ? normalized : m));
      }
      return [...prev, normalized];
    });
  };

  const fetchConversation = async () => {
    try {
      const response = await chatApi.getConversation();

      if (response.success) {
        const normalizedMessages = (response.data.messages || []).map(normalizeMessage);
        setMessages(normalizedMessages);
        setConversationId(response.data.conversation?.id || null);
        setTrainerAvatar(response.data.conversation?.admin_avatar || null);

        if (response.data.conversation?.id) {
          await chatApi.markAsRead();
        }
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchConversation();
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    if (subscribedConversationRef.current === conversationId) return;
    subscribedConversationRef.current = conversationId;

    const echo = getEcho();
    const privateChannel = echo.private(`chat.${conversationId}`);
    const presenceChannel = echo.join(`chat.${conversationId}`);

    privateChannel.listen('.chat.message.sent', async (payload) => {
      if (!payload?.message) return;

      const normalizedMessage = normalizeMessage(payload.message);
      upsertMessage(normalizedMessage);

      if (normalizedMessage.sender === 'trainer') {
        try {
          await chatApi.markAsRead();
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    });

    privateChannel.listen('.chat.messages.read', (payload) => {
      if (payload.reader_role !== 'admin') return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === 'user'
            ? { ...msg, is_read: true, status: 'read', read_at: payload.read_at }
            : msg
        )
      );
    });

    privateChannel.listen('.chat.typing', (payload) => {
      if (payload.role === 'admin') {
        setTrainerTyping(Boolean(payload.is_typing));
      }
    });

    presenceChannel.here((users) => {
      const trainerExists = users.some((u) => u.role === 'admin');
      setTrainerOnline(trainerExists);
    });

    presenceChannel.joining((user) => {
      if (user.role === 'admin') {
        setTrainerOnline(true);
      }
    });

    presenceChannel.leaving((user) => {
      if (user.role === 'admin') {
        setTrainerOnline(false);
      }
    });

    return () => {
      echo.leave(`chat.${conversationId}`);
      subscribedConversationRef.current = null;
    };
  }, [conversationId]);

  const handleTypingChange = (value) => {
    setChatMessage(value);

    if (!conversationId) return;

    chatApi.sendTyping(true).catch(() => { });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      chatApi.sendTyping(false).catch(() => { });
    }, 1200);
  };

  const handleSendMessage = async (messageText, imageFile = null) => {
    if ((!messageText || !messageText.trim()) && !imageFile) return;

    setSending(true);

    try {
      let response;

      if (imageFile) {
        response = await chatApi.sendMessageWithImage(messageText, imageFile);
      } else {
        response = await chatApi.sendMessage(messageText);
      }

      if (response.success && response.data) {
        const normalizedOwnMessage = normalizeMessage({
          ...response.data,
          sender: 'user',
          sender_type: 'trainee',
          type: response.data.type || response.data.message_type,
          status: response.data.is_read ? 'read' : 'sent',
        });

        upsertMessage(normalizedOwnMessage);
        setChatMessage('');
        clearTimeout(typingTimeoutRef.current);
        chatApi.sendTyping(false).catch(() => { });
      }
    } catch (error) {
      console.error('Error sending message:', error);

      Swal.fire({
        title: t('خطأ', 'Error'),
        text: t('فشل في إرسال الرسالة', 'Failed to send message'),
        icon: 'error',
        confirmButtonText: t('حسناً', 'OK'),
        confirmButtonColor: '#FDB813',
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="chat-tab loading">
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>{t('جاري تحميل المحادثة...', 'Loading conversation...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-tab">
      <ChatContainer
        messages={sortedMessages}
        chatMessage={chatMessage}
        setChatMessage={handleTypingChange}
        onSendMessage={handleSendMessage}
        sending={sending}
        trainerAvatar={trainerAvatar}
        trainerOnline={trainerOnline}
        trainerTyping={trainerTyping}
      />
    </div>
  );
};

export default ChatTab;