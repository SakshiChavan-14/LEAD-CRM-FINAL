"use client";

import { usePathname } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import RoleGuard from "@/features/auth/components/RoleGuard";
import { ROLES } from "@/constants/roles";
import { VoiceProvider } from "@/features/telecaller/voice/context/VoiceProvider";
import GlobalQuickCallWidget from "@/features/telecaller/shared/quick-call/GlobalQuickCallWidget";

export default function TelecallerLayout({ children }) {
  const pathname = usePathname();
  const isCallingPage = pathname?.startsWith("/telecaller/calling");

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={[ROLES.TELE_CALLER]}>
        <VoiceProvider>
          {isCallingPage ? (
            <div className="min-h-screen bg-[#FAFBFD] font-outfit">
              {children}
            </div>
          ) : (
            <DashboardShell>
              {children}
              <GlobalQuickCallWidget />
            </DashboardShell>
          )}
        </VoiceProvider>
      </RoleGuard>
    </ProtectedRoute>
  );
}