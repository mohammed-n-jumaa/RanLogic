import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import ChatContainer from './chat/ChatContainer';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import chatApi from '../../api/chatApi';
import Swal from 'sweetalert2';

const ChatTab = () => {
  const { t } = useProfileLanguage();
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [trainerAvatar, setTrainerAvatar] = useState(null);

  useEffect(() => {
    fetchConversation();
    
    const interval = setInterval(fetchConversation, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchConversation = async () => {
    try {
      const response = await chatApi.getConversation();
      
      if (response.success) {
        setMessages(response.data.messages || []);
        setConversationId(response.data.conversation?.id);
        
        if (response.data.conversation?.admin_avatar) {
          setTrainerAvatar(response.data.conversation.admin_avatar);
        }
        
        if (response.data.conversation?.id) {
          await chatApi.markAsRead(response.data.conversation.id);
        }
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
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
      
      if (response.success) {
        setChatMessage('');
        await fetchConversation();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      Swal.fire({
        title: t('خطأ', 'Error'),
        text: t('فشل في إرسال الرسالة', 'Failed to send message'),
        icon: 'error',
        confirmButtonText: t('حسناً', 'OK'),
        confirmButtonColor: '#FDB813'
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
        messages={messages}
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        onSendMessage={handleSendMessage}
        sending={sending}
        trainerAvatar={trainerAvatar}
      />
    </div>
  );
};

export default ChatTab;