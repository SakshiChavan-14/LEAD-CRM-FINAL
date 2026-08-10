import {
  LayoutDashboard,
  BriefcaseBusiness,
  LineChart,
  Settings,
  User,
  BarChart3
} from "lucide-react";

import { ROLES } from "@/constants/roles";

const navigation = [
  {
    title: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN, ROLES.TELE_CALLER],
  },
  {
    title: "Management",
    path: "/dashboard/management",
    icon: BriefcaseBusiness,
    roles: [ROLES.ADMIN],
    subItems: [
      { title: "Leads", path: "/dashboard/management/leads" },
      { title: "User Directory", path: "/dashboard/management/user-directory" },
      { title: "Call Reports", path: "/dashboard/management/call-reports" },
    ]
  },

  {
    title: "Reports",
    path: "/dashboard/reports",
    icon: BarChart3,
    roles: [ROLES.ADMIN],
  },
];

export default navigation;