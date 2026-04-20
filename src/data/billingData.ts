import { OrgBilling } from "@/types/admin";

export const EUR_PER_1K_TOKENS = 0.005;

export const mockBilling: OrgBilling = {
  planName: "Pro",
  planBudgetEur: 50,
  overageEnabled: true,
  overageCapEur: 100,
  cycleStart: "2026-04-01",
  cycleEnd: "2026-04-30",
};
