import Skeleton from "react-loading-skeleton";
import { Link } from "react-router";
import { Card, Avatar, Button } from "@heroui/react";
import { useContext } from "react";
import { NotificationContContext } from "../../Context/NotificationContext/NotificationContext";
import { Bell, Heart, MessageSquare, UserPlus } from "lucide-react";

// Helper: Format relative time
function timeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Notifications() {
  // Context Logic
  const { notifications, isLoading, isError, refetch } =
    useContext(NotificationContContext) || {};

  // UI Helper: Get notification content based on type
  const getNotificationDetails = (notification) => {
    const { type, actor, entity, entityId } = notification;
    let text = <></>;
    let icon = <Bell size={14} className="text-gray-500" />;
    let iconBg = "bg-gray-100";
    let link = "#";
    let snippet = "";

    switch (type) {
      case "comment_post":
        text = (
          <>
            <span className="font-bold text-gray-900 dark:text-slate-100">
              {actor?.name}
            </span>{" "}
            commented on your post.
          </>
        );
        icon = (
          <MessageSquare size={14} className="text-blue-600 fill-blue-600" />
        );
        iconBg = "bg-blue-100";
        link = `/post-details/${entityId}`;
        snippet = entity?.topComment?.content || entity?.body;
        break;
      case "like_post":
        text = (
          <>
            <span className="font-bold text-gray-900 dark:text-slate-100">
              {actor?.name}
            </span>{" "}
            liked your post.
          </>
        );
        icon = <Heart size={14} className="text-red-500 fill-red-500" />;
        iconBg = "bg-red-100";
        link = `/post-details/${entityId}`;
        snippet = entity?.body;
        break;
      case "follow_user":
        text = (
          <>
            <span className="font-bold text-gray-900 dark:text-slate-100">
              {actor?.name}
            </span>{" "}
            started following you.
          </>
        );
        icon = (
          <UserPlus size={14} className="text-emerald-600 fill-emerald-600" />
        );
        iconBg = "bg-emerald-100";
        link = `/profile-user/${actor?._id}`;
        break;
      default:
        text = (
          <>
            <span className="font-bold text-gray-900 dark:text-slate-100">
              {actor?.name}
            </span>{" "}
            interacted with you.
          </>
        );
        link = `/profile-user/${actor?._id}`;
        break;
    }
    return { text, icon, iconBg, link, snippet };
  };

  // Render: Loading State
  if (isLoading) {
    return (
      <div className="max-w-170 mx-auto w-full p-4 md:py-8 mt-2 space-y-4">
        <h1 className="text-2xl md:text-[28px] font-extrabold mb-6 text-gray-900 dark:text-slate-100 flex items-center gap-3">
          <div className="p-2 bg-amber-100/50 rounded-full">
            <Bell size={26} className="text-amber-500 fill-amber-500" />
          </div>
          Notifications
        </h1>
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="w-full bg-white/60 dark:bg-slate-800/60 p-4 shadow-sm border border-gray-100/50 dark:border-slate-700/50 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <Skeleton circle className="shrink-0 w-12 h-12" />
              <div className="flex-1 mt-1">
                <Skeleton className="w-[70%] h-4 mb-2 rounded-lg" />
                <Skeleton className="w-[40%] h-3 rounded-lg" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Render: Error State
  if (isError) {
    return (
      <div className="max-w-170 mx-auto w-full p-4 md:py-8 mt-10 text-center">
        <div className="bg-red-50 text-red-500 rounded-2xl p-6 border border-red-100 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            Oops! Something went wrong
          </h2>
          <Button color="danger" variant="flat" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <>
    <title>Notifications</title>

      <div className="max-w-170 mx-auto w-full p-4 md:py-8 mt-2">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 px-1">
          <h1 className="text-2xl md:text-[28px] font-extrabold text-gray-900 dark:text-slate-100 flex items-center gap-3">
            <div className="p-2 bg-amber-100/50 rounded-full shadow-inner">
              <Bell
                size={26}
                className="text-amber-500 fill-amber-500 drop-shadow-sm"
              />
            </div>
            Notifications
          </h1>
          <Button
            variant="light"
            color="primary"
            size="sm"
            className="font-semibold px-4 rounded-full"
          >
            Mark all as read
          </Button>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-2.5">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => {
              const { text, icon, iconBg, link, snippet } =
                getNotificationDetails(notification);
              const { isRead, createdAt, actor, _id } = notification;

              return (
                <Link to={link} key={_id} className="block group">
                  <Card
                    className={`w-full p-4 transition-all duration-300 border border-transparent shadow-sm hover:shadow-md ${
                      !isRead
                        ? "bg-blue-50/50 dark:bg-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/40 border-blue-100/50 dark:border-blue-800/50"
                        : "bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800"
                    }`}
                    radius="lg"
                  >
                    <div className="flex items-start gap-4">
                      {/* Actor Avatar & Badge */}
                      <div className="relative shrink-0">
                        <Avatar
                          src={
                            actor?.photo ||
                            "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                          }
                          size="md"
                          className="cursor-pointer border-2 border-white shadow-sm w-12 h-12"
                          isBordered={!isRead}
                          color={!isRead ? "primary" : "default"}
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${iconBg} border-2 border-white flex items-center justify-center shadow-sm z-10`}
                        >
                          {icon}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 pt-0.5 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <p
                            className={`text-[15px] leading-snug tracking-tight ${!isRead ? "text-gray-900 dark:text-slate-100" : "text-gray-700 dark:text-slate-300"}`}
                          >
                            {text}
                          </p>
                          <span
                            className={`text-[12px] whitespace-nowrap font-medium shrink-0 mt-0.5 ${!isRead ? "text-blue-500" : "text-gray-400 dark:text-slate-500"}`}
                          >
                            {timeAgo(createdAt)}
                          </span>
                        </div>
                        {snippet && (
                          <p
                            className={`mt-1 text-[13.5px] truncate max-w-full font-medium ${!isRead ? "text-gray-600 dark:text-slate-300" : "text-gray-500 dark:text-slate-400"}`}
                          >
                            "{snippet}"
                          </p>
                        )}
                      </div>
                      {!isRead && (
                        <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-blue-500 mt-2.5 shadow-sm shadow-blue-500/40" />
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-inner mt-4">
              <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-700">
                <Bell size={36} className="text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-700 dark:text-slate-200 mb-2">
                Caught up!
              </h2>
              <p className="text-gray-500 dark:text-slate-400 font-medium tracking-tight">
                You don't have any new notifications right now.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
