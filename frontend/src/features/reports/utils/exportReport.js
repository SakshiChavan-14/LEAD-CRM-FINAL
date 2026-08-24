// features/reports/utils/exportReport.js

import reportsService from "../services/reportsService";

export const exportTeamPDF = async (range = "this-month", team = "all") => {
  const blob = await reportsService.exportTeamReport("pdf", range, team);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const teamFormatted = team === "all" ? "all-teams" : team;
  a.href = url;
  a.download = `reports-${range}-${teamFormatted}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportTeamExcel = async (range = "this-month", team = "all") => {
  const blob = await reportsService.exportTeamReport("xlsx", range, team);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const teamFormatted = team === "all" ? "all-teams" : team;
  a.href = url;
  a.download = `reports-${range}-${teamFormatted}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportTelecallerPDF = async (telecallerId) => {
  const blob = await reportsService.exportTelecallerReport(telecallerId, "pdf");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `telecaller-${telecallerId}-report.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
