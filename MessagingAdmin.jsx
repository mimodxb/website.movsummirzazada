import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useConversations } from '@/hooks/useConversations';
import ConversationList from '@/components/ConversationList';
import MessageThread from '@/components/MessageThread';
import MessageInput from '@/components/MessageInput';
import ConversationHeader from '@/components/ConversationHeader';
import { messagingService } from '@/lib/messagingService';

const MessagingAdmin = () => {
  const { user } = useAuth();
  const { conversations, loading } = useConversations(user?.id, 'admin'); // Assuming admin sees all or user ID is admin
  const [selectedId, setSelectedId] = useState(null);

  const selectedConversation = conversations.find(c => c.id === selectedId);

  const handleSend = async (text, attachments) => {
    if (!selectedConversation) return;
    await messagingService.sendMessage(
      selectedConversation.id,
      { id: user.id, type: 'admin', name: 'Mimo Support', email: 'contact@movsummirzazada.com' },
      text,
      attachments
    );
  };

  return (
    <div className="h-[700px] bg-[#0A1612] flex rounded-xl border border-[#E0A995]/10 overflow-hidden shadow-2xl">
      <div className="w-[350px] border-r border-[#E0A995]/10">
        <ConversationList 
          conversations={conversations} 
          selectedId={selectedId} 
          onSelect={(c) => setSelectedId(c.id)}
          loading={loading}
        />
      </div>
      <div className="flex-1 flex flex-col bg-[#0A1612]">
        {selectedConversation ? (
          <>
            <ConversationHeader conversation={selectedConversation} isClient={false} />
            <MessageThread conversationId={selectedConversation.id} />
            <MessageInput onSend={handleSend} conversationId={selectedConversation.id} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#A8B3AF]">
            Select a conversation to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingAdmin;