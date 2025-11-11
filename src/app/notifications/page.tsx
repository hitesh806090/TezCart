"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { Bell, Check, Trash2 } from "lucide-react";

export default function NotificationsPage() {
  const { status } = useSession();
  const router = useRouter();

  const { data: notifications, isLoading, refetch } = api.notification.getMyNotifications.useQuery(
    undefined,
    { enabled: status === "authenticated" }
  );

  const markAsReadMutation = api.notification.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const markAllAsReadMutation = api.notification.markAllAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteMutation = api.notification.delete.useMutation({
    onSuccess: () => refetch(),
  });

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

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>

        {!notifications || notifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No notifications</h2>
              <p className="text-muted-foreground">You're all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification: any) => (
              <Card
                key={notification.id}
                className={`${!notification.isRead ? "border-primary" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.isRead && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      {notification.link && (
                        <Button asChild variant="link" size="sm" className="px-0 mt-2">
                          <Link href={notification.link}>View Details</Link>
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            markAsReadMutation.mutate({
                              notificationId: notification.id,
                            })
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Delete this notification?")) {
                            deleteMutation.mutate({ notificationId: notification.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
