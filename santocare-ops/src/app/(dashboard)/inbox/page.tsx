"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, MessageSquare, Mail, Phone, MessageCircle, Send, Loader2, AlertCircle } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetch-client";

type CommType = "WHATSAPP" | "EMAIL" | "CALL" | "MESSAGE";
type CommDirection = "INBOUND" | "OUTBOUND";

interface CommItem {
  id: string;
  patientId: string;
  type: CommType;
  direction: CommDirection;
  content: string;
  createdAt: string;
  createdBy?: { name: string };
  patient?: { name: string };
}

const CHANNEL_CONFIG: Record<CommType, { icon: any; color: string; label: string }> = {
  WHATSAPP: { icon: MessageCircle, color: "bg-green-100 text-green-800", label: "WhatsApp" },
  EMAIL: { icon: Mail, color: "bg-blue-100 text-blue-800", label: "Email" },
  CALL: { icon: Phone, color: "bg-purple-100 text-purple-800", label: "Call" },
  MESSAGE: { icon: MessageSquare, color: "bg-gray-100 text-gray-800", label: "Internal" },
};

export default function InboxPage() {
  const [items, setItems] = React.useState<CommItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [selected, setSelected] = React.useState<CommItem | null>(null);

  const [composeOpen, setComposeOpen] = React.useState(false);
  const [composeType, setComposeType] = React.useState<CommType>("MESSAGE");
  const [composePatientId, setComposePatientId] = React.useState("");
  const [composeContent, setComposeContent] = React.useState("");
  const [composeDirection, setComposeDirection] = React.useState<CommDirection>("OUTBOUND");
  const [submitting, setSubmitting] = React.useState(false);
  const [composeError, setComposeError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    params.set("limit", "100");
    try {
      const res = await fetchWithAuth(`/api/messages?${params}`);
      if (!res.ok) throw new Error("Failed to load messages");
      const json = await res.json();
      setItems(json.data ?? []);
    } catch (e: any) {
      setError(e.message ?? "Error loading messages");
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  React.useEffect(() => { load(); }, [load]);

  const filtered = items.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.content.toLowerCase().includes(q) ||
      m.patient?.name?.toLowerCase().includes(q) ||
      m.createdBy?.name?.toLowerCase().includes(q)
    );
  });

  const submitCompose = async () => {
    if (!composePatientId || !composeContent) return;
    setSubmitting(true);
    setComposeError(null);
    try {
      const res = await fetchWithAuth("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          patientId: composePatientId,
          type: composeType,
          direction: composeDirection,
          content: composeContent,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send message");
      setComposeOpen(false);
      setComposeContent("");
      setComposePatientId("");
      await load();
    } catch (e: any) {
      setComposeError(e.message ?? "Error sending message");
    } finally {
      setSubmitting(false);
    }
  };

  const fmtDate = (s: string) => {
    const d = new Date(s);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      <div className="w-2/5 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <Button size="sm" onClick={() => setComposeOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Message
          </Button>
        </div>

        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select
            options={[
              { value: "", label: "All Types" },
              { value: "WHATSAPP", label: "WhatsApp" },
              { value: "EMAIL", label: "Email" },
              { value: "CALL", label: "Call" },
              { value: "MESSAGE", label: "Internal" },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-[160px]"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No messages found</div>
            ) : (
              filtered.map((item) => {
                const cfg = CHANNEL_CONFIG[item.type];
                const Icon = cfg.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`border-b p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selected?.id === item.id ? "bg-muted" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${cfg.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{item.patient?.name || "Unknown"}</span>
                          <span className="text-xs text-muted-foreground shrink-0 ml-2">{fmtDate(item.createdAt)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">{item.content}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{cfg.label}</Badge>
                          <Badge variant="outline" className={`text-xs ${item.direction === "INBOUND" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                            {item.direction === "INBOUND" ? "Received" : "Sent"}
                          </Badge>
                          {item.createdBy?.name && (
                            <span className="text-xs text-muted-foreground">by {item.createdBy.name}</span>
                          )}
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

      <div className="flex-1 flex flex-col">
        {selected ? (
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selected.patient?.name || "Unknown"}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {CHANNEL_CONFIG[selected.type].label} · {selected.direction === "INBOUND" ? "Received" : "Sent"}
                    {selected.createdBy?.name && ` · by ${selected.createdBy.name}`}
                  </p>
                </div>
                <Badge className={CHANNEL_CONFIG[selected.type].color}>
                  {CHANNEL_CONFIG[selected.type].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="whitespace-pre-wrap text-sm">{selected.content}</p>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {new Date(selected.createdAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input placeholder="Type a reply (stored as outbound MESSAGE)..." className="flex-1" />
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

      <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} title="New Message">
        <DialogContent className="max-w-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comm-patientId">Patient ID *</Label>
              <Input id="comm-patientId" value={composePatientId} onChange={(e) => setComposePatientId(e.target.value)} placeholder="Patient record ID" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Channel</Label>
                <Select
                  options={[
                    { value: "WHATSAPP", label: "WhatsApp" },
                    { value: "EMAIL", label: "Email" },
                    { value: "CALL", label: "Call" },
                    { value: "MESSAGE", label: "Internal" },
                  ]}
                  value={composeType}
                  onChange={(e) => setComposeType(e.target.value as CommType)}
                />
              </div>
              <div className="space-y-2">
                <Label>Direction</Label>
                <Select
                  options={[
                    { value: "OUTBOUND", label: "Outbound" },
                    { value: "INBOUND", label: "Inbound" },
                  ]}
                  value={composeDirection}
                  onChange={(e) => setComposeDirection(e.target.value as CommDirection)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comm-content">Message *</Label>
              <Textarea id="comm-content" value={composeContent} onChange={(e) => setComposeContent(e.target.value)} rows={4} placeholder="Type your message..." required />
            </div>
            {composeError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="h-4 w-4" /> {composeError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={submitCompose} disabled={submitting || !composePatientId || !composeContent}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending...</> : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
