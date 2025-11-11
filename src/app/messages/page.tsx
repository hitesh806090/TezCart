"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: conversations, isLoading } = api.message.getConversations.useQuery(
    undefined,
    { enabled: status === "authenticated" }
  );

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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>

        {!conversations || conversations.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No conversations yet</h2>
              <p className="text-muted-foreground mb-6">
                Start a conversation with a seller from a product page
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation: any) => {
              const lastMessage = conversation.messages[0];
              const isCustomer = conversation.customerId === session?.user.id;
              const otherParty = isCustomer
                ? conversation.seller?.storeName
                : conversation.customer?.name;

              return (
                <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                  <Card className="hover:bg-accent transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{otherParty}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {isCustomer ? "Seller" : "Customer"}
                            </Badge>
                          </div>
                          {lastMessage && (
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                              {lastMessage.content}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(conversation.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
