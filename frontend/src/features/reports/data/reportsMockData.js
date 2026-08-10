const baseData = {
  kpi: {
    callsMade: { value: 1248, trend: "+8.4%" },
    connected: { value: 812, trend: "+12.1%" },
    interested: { value: 146, trend: "+4.2%" },
    followups: { value: 89, trend: "-2.3%" },
    admissions: { value: 24, trend: "+1.8%" },
    conversion: { value: "16.8%", trend: "+6.7%" }
  },
  teamSnapshot: {
    activeTelecallers: 6,
    topPerformer: { name: "Sakshi", admissions: 6 },
    teamGoal: { percentage: 68 }
  },
  funnel: [
    { name: "Assigned", value: 1248, rate: null },
    { name: "Connected", value: 812, rate: "65.1%" },
    { name: "Interested", value: 146, rate: "18.0%" },
    { name: "Follow-up", value: 89, rate: "61.0%" },
    { name: "Converted", value: 24, rate: "27.0%" }
  ],
  productivityTrend: [
    { day: "Mon", calls: 132, connected: 86, interested: 18, followups: 14, admissions: 2, rate: 14.2 },
    { day: "Tue", calls: 158, connected: 104, interested: 21, followups: 13, admissions: 3, rate: 15.1 },
    { day: "Wed", calls: 149, connected: 98, interested: 19, followups: 12, admissions: 4, rate: 15.8 },
    { day: "Thu", calls: 176, connected: 116, interested: 24, followups: 15, admissions: 3, rate: 16.2 },
    { day: "Fri", calls: 182, connected: 121, interested: 22, followups: 14, admissions: 4, rate: 16.5 },
    { day: "Sat", calls: 171, connected: 118, interested: 20, followups: 11, admissions: 3, rate: 16.1 },
    { day: "Sun", calls: 188, connected: 129, interested: 22, followups: 10, admissions: 5, rate: 16.8 }
  ],
  monthlyTrend: [
    { month: "Mar", calls: 820, interested: 102, admissions: 16 },
    { month: "Apr", calls: 910, interested: 118, admissions: 18 },
    { month: "May", calls: 1040, interested: 131, admissions: 19 },
    { month: "Jun", calls: 1125, interested: 142, admissions: 21 },
    { month: "Jul", calls: 1198, interested: 151, admissions: 23 },
    { month: "Aug", calls: 1248, interested: 146, admissions: 24 }
  ],
  leaderboard: [
    { id: 1, rank: 1, name: "Sakshi Chavan", admissions: 6, conversion: 18.2, calls: 842 },
    { id: 2, rank: 2, name: "Naruto", admissions: 5, conversion: 16.7, calls: 801 },
    { id: 3, rank: 3, name: "Pooja Verma", admissions: 4, conversion: 15.4, calls: 756 },
    { id: 4, rank: 4, name: "Harsha B", admissions: 4, conversion: 14.8, calls: 722 },
    { id: 5, rank: 5, name: "Rahul Sharma", admissions: 3, conversion: 13.9, calls: 689 }
  ],
  sourcePerformance: [
    { source: "Instagram", leads: 320, admissions: 9 },
    { source: "Website", leads: 268, admissions: 6 },
    { source: "Referral", leads: 214, admissions: 5 },
    { source: "Walk-in", leads: 176, admissions: 3 },
    { source: "Facebook", leads: 142, admissions: 1 }
  ],
  courseDistribution: [
    { course: "MCA", count: 312 },
    { course: "Cybersecurity", count: 248 },
    { course: "BCA", count: 221 },
    { course: "MBA", count: 167 },
    { course: "Data Science", count: 124 }
  ]
};

export const reportsMockData = {
  lastUpdatedAt: new Date(Date.now() - 120000).toISOString(),
  thisMonth: baseData,
  lastMonth: {
    ...baseData,
    kpi: {
      ...baseData.kpi,
      callsMade: { value: 1198, trend: "+4.1%" },
      admissions: { value: 23, trend: "+1.2%" },
    },
    teamSnapshot: { ...baseData.teamSnapshot, topPerformer: { name: "Naruto", admissions: 7 } },
  },
  last3Months: {
    ...baseData,
    kpi: {
      ...baseData.kpi,
      callsMade: { value: 3571, trend: "+12.4%" },
      admissions: { value: 68, trend: "+8.9%" },
    },
    teamSnapshot: { ...baseData.teamSnapshot, topPerformer: { name: "Sakshi", admissions: 18 } },
  }
};
