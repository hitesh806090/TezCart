"use client";

import { use, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { ArrowLeft, Send } from "lucide-react";

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversation, isLoading, refetch } = api.message.getConversation.useQuery(
    { conversationId: resolvedParams.id },
    { enabled: status === "authenticated", refetchInterval: 5000 }
  );

  const sendMessageMutation = api.message.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      refetch();
    },
  });

  const markAsReadMutation = api.message.markAsRead.useMutation();

  useEffect(() => {
    if (conversation) {
      markAsReadMutation.mutate({ conversationId: conversation.id });
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (!conversation) {
    return null;
  }

  const isCustomer = conversation.customerId === session?.user.id;
  const otherParty = isCustomer
    ? conversation.seller?.storeName
    : conversation.customer?.name;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessageMutation.mutate({
      conversationId: conversation.id,
      content: message,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col">
      <div className="border-b">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/messages">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="font-semibold">{otherParty}</h2>
            <p className="text-xs text-muted-foreground">
              {isCustomer ? "Seller" : "Customer"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl py-4 space-y-4">
          {conversation.messages.map((msg: any) => {
            const isMine = msg.senderId === session?.user.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <Card className={`max-w-[70%] ${isMine ? "bg-primary text-primary-foreground" : ""}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t">
        <div className="container max-w-4xl py-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={sendMessageMutation.isPending}
            />
            <Button type="submit" disabled={sendMessageMutation.isPending || !message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
