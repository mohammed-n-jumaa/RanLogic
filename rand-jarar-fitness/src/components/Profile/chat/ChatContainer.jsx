import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const ChatContainer = ({ 
  messages, 
  chatMessage, 
  setChatMessage, 
  onSendMessage, 
  sending,
  trainerAvatar 
}) => {
  const { t } = useProfileLanguage();

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          {trainerAvatar && (
            <div className="trainer-header-avatar">
              <img src={trainerAvatar} alt="Trainer" />
            </div>
          )}
          <div className="header-text">
            <h3>{t('المحادثة مع المدربة رند', 'Chat with Trainer Rand')}</h3>
          </div>
        </div>
      </div>
      
      <MessagesList 
        messages={messages} 
        trainerAvatar={trainerAvatar}
      />
      
      <MessageInput
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        onSendMessage={onSendMessage}
        sending={sending}
      />
    </div>
  );
};

export default ChatContainer;