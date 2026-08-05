import LeadInfoTab from "@/features/leads/components/information/LeadInfoTab";
import LeadTimelineTab from "@/features/leads/components/timeline/LeadTimelineTab";
import LeadNotesTab from "@/features/leads/components/notes/LeadNotesTab";
import LeadDocumentsTab from "@/features/leads/components/documents/LeadDocumentsTab";
import LeadActivityTab from "../components/details/tabs/LeadActivityTab";
import ContactSection from "@/features/leads/components/information/ContactSection";
import LeadInformationSection from "@/features/leads/components/information/LeadInformationSection";
import AssignmentSection from "@/features/leads/components/assignments/AssignmentSection";
import AdminActionsCard from "../components/details/sections/AdminActionsCard";

export const TABS_CONFIG = [
  { id: "info", label: "Overview", component: LeadInfoTab },
  { id: "timeline", label: "Timeline", component: LeadTimelineTab },
  { id: "notes", label: "Notes", component: LeadNotesTab }
];

export const INFO_SECTIONS = [
  { id: "contact", title: "Contact Details", component: ContactSection },
  { id: "lead", title: "Lead Information", component: LeadInformationSection },
  { id: "assignment", title: "Assignment", component: AssignmentSection },
  { id: "admin", title: "Admin Actions", component: AdminActionsCard }
];
