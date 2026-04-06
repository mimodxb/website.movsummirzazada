import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import UnreadBadge from '@/components/UnreadBadge';

const ConversationList = ({ conversations = [], onSelectConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.client_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0A1612]/50 border-r border-[#E0A995]/10">
      <div className="p-4 border-b border-[#E0A995]/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search conversations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-[#13251E] border-[#E0A995]/20 text-[#EBE8E3]"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No conversations found.
          </div>
        ) : (
          <div className="divide-y divide-[#E0A995]/10">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className="p-4 hover:bg-[#E0A995]/5 cursor-pointer transition-colors relative group"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-[#EBE8E3] truncate pr-2">
                    {conv.client_name || conv.client_email}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {conv.last_message_at && format(new Date(conv.last_message_at), 'MMM d, h:mm a')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate w-4/5">
                    {conv.last_message_snippet || 'No messages yet'}
                  </p>
                  <UnreadBadge count={conv.unread_count} />
                </div>
                
                <div className="absolute inset-y-0 left-0 w-1 bg-[#E0A995] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;