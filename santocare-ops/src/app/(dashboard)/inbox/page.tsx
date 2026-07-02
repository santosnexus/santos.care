"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, MessageSquare, Mail, Phone, MessageCircle, Send } from "lucide-react";

interface Message {
  id: string;
  channel: string;
  direction: string;
  bodyText: string;
  status: string;
  patient?: { name: string };
  fromPhone?: string;
  toPhone?: string;
  fromAddress?: string;
  toAddress?: string;
  createdAt: string;
}

const channelIcons: Record<string, any> = {
  WHATSAPP: MessageCircle,
  EMAIL: Mail,
  SMS: MessageSquare,
  INTERNAL: Phone,
};

const channelColors: Record<string, string> = {
  WHATSAPP: "bg-green-100 text-green-800",
  EMAIL: "bg-blue-100 text-blue-800",
  SMS: "bg-purple-100 text-purple-800",
  INTERNAL: "bg-gray-100 text-gray-800",
};

export default function InboxPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [channelFilter, setChannelFilter] = React.useState("");
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);

  React.useEffect(() => {
    fetchMessages();
  }, [channelFilter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (channelFilter) params.set("channel", channelFilter);
      const res = await fetch(`/api/messages?${params}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter((m) =>
    m.bodyText?.toLowerCase().includes(search.toLowerCase()) ||
    m.patient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Message List */}
      <div className="w-1/3 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All Channels</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="EMAIL">Email</option>
            <option value="SMS">SMS</option>
            <option value="INTERNAL">Internal</option>
          </select>
        </div>

        {/* Message List */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No messages found</div>
            ) : (
              filteredMessages.map((message) => {
                const ChannelIcon = channelIcons[message.channel] || MessageSquare;
                return (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`border-b p-4 cursor-pointer hover:bg-muted/50 ${
                      selectedMessage?.id === message.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${channelColors[message.channel] || ""}`}>
                        <ChannelIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">
                            {message.patient?.name || "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.bodyText}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {message.direction}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {message.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Detail */}
      <div className="flex-1 flex flex-col">
        {selectedMessage ? (
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedMessage.patient?.name || "Unknown"}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.channel} • {selectedMessage.direction}
                  </p>
                </div>
                <Badge className={channelColors[selectedMessage.channel] || ""}>
                  {selectedMessage.channel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="whitespace-pre-wrap">{selectedMessage.bodyText}</p>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input placeholder="Type a reply..." className="flex-1" />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
