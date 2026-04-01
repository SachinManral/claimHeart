"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { AppUser, UserRole } from "@/types";

export default function NotifBell({ role, user }: { role: UserRole; user: AppUser | null }) {
  const notifications = useAppStore((state) => state.notifications);
  const unread = notifications.filter((notification) => {
    const matchesRole = notification.targetRole === role || notification.targetRole === "all";
    const matchesUser = !notification.targetUserId || notification.targetUserId === user?.id || notification.targetUserId === user?.patientId;
    return matchesRole && matchesUser && !notification.read;
  }).length;

  return (
    <Link href={`/dashboard/${role}/notifications`} className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100">
      <Bell className="h-5 w-5" />
      {unread > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      ) : null}
    </Link>
  );
}
