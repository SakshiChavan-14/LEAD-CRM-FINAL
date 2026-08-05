import TelecallerOverviewTab from "@/features/telecaller/leads/components/TelecallerOverviewTab";
import TelecallerTimelineTab from "@/features/telecaller/leads/components/TelecallerTimelineTab";
import TelecallerNotesTab from "@/features/telecaller/leads/components/TelecallerNotesTab";

/**
 * Telecaller tab configuration.
 * Only Overview, Timeline, Notes — Documents and Activity have no backend endpoints.
 * Uses TelecallerOverviewTab (not Admin's LeadInfoTab) so secondary actions
 * (Upload Document, View History) live inside the cards, not the hero.
 */
export const TELECALLER_TABS_CONFIG = [
  { id: "info", label: "Overview", component: TelecallerOverviewTab },
  { id: "timeline", label: "Timeline", component: TelecallerTimelineTab },
  { id: "notes", label: "Notes", component: TelecallerNotesTab },
];
