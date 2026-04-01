import AppShell from "@/components/layout/AppShell";
import NotificationsPage from "@/components/pages/NotificationsPage";

export default function PatientNotificationsRoute() {
  return <AppShell><NotificationsPage role="patient" /></AppShell>;
}
