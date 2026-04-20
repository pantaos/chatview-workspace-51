import { ModelLimit, OrgTokenLimits, TeamModelAccess, UserDailyLimit } from "@/types/admin";

export const mockModels: ModelLimit[] = [
  { id: "gpt-5", name: "GPT-5", category: "text", enabled: true, limit: 4_000_000, used: 2_100_000 },
  { id: "gpt-4o", name: "GPT-4o", category: "text", enabled: true, limit: 3_000_000, used: 1_800_000 },
  { id: "claude-sonnet", name: "Claude Sonnet", category: "text", enabled: true, limit: 2_000_000, used: 900_000 },
  { id: "gpt-5-mini", name: "GPT-5 Mini", category: "text", enabled: true, limit: 1_000_000, used: 600_000 },
  { id: "dalle-3", name: "DALL-E 3", category: "image", enabled: true, limit: 500, used: 180 },
  { id: "gemini-flash-img", name: "Gemini Flash Image", category: "image", enabled: false, limit: 200, used: 45 },
];

export const mockOrgLimits: OrgTokenLimits = {
  globalLimit: 10_000_000,
  globalUsed: 6_742_300,
  totalRequests: 12_430,
  resetCycle: "monthly",
  userDailyLimitsEnabled: false,
  defaultUserDailyLimit: 50_000,
};

export const mockTeamAccess: TeamModelAccess[] = [
  { teamId: "1", teamName: "Engineering", teamColor: "blue", modelIds: ["gpt-5", "gpt-4o", "claude-sonnet"] },
  { teamId: "2", teamName: "Marketing", teamColor: "purple", modelIds: ["gpt-4o", "gpt-5-mini", "dalle-3"] },
  { teamId: "3", teamName: "Content", teamColor: "green", modelIds: ["claude-sonnet", "gpt-5-mini", "dalle-3"] },
];

export const mockUserDailyLimits: UserDailyLimit[] = [
  { userId: "u1", userName: "Moin Arian", email: "moin@example.com", limit: 100_000, usedToday: 32_000, isOverride: true },
  { userId: "u2", userName: "Anna Schmidt", email: "anna@example.com", limit: 50_000, usedToday: 12_400, isOverride: false },
  { userId: "u3", userName: "Tobias Müller", email: "tobias@example.com", limit: 50_000, usedToday: 48_900, isOverride: false },
  { userId: "u4", userName: "Lisa Weber", email: "lisa@example.com", limit: 75_000, usedToday: 5_200, isOverride: true },
  { userId: "u5", userName: "Jonas Becker", email: "jonas@example.com", limit: 50_000, usedToday: 0, isOverride: false },
];
