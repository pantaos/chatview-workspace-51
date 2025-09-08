export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'User' | 'Admin' | 'Super Admin';
  avatarUrl?: string;
  teams: UserTeam[];
  tokensUsed: number;
  workflowsCreated: number;
  assistantsCreated: number;
  createdAt: string;
  lastLogin?: string;
}

export interface UserTeam {
  id: string;
  name: string;
  color: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  members: TeamMember[];
  createdAt: string;
  description?: string;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTokensUsed: number;
  totalWorkflows: number;
  totalAssistants: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalQueriesSent: number;
  hoursSaved: number;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  creditsPerRequest: number;
  totalRequests: number;
  totalCreditsUsed: number;
  icon: string;
  category: 'Text' | 'Image' | 'Audio' | 'Video';
}

export interface CreditUsage {
  totalCreditsAvailable: number;
  totalCreditsUsed: number;
  creditsRemaining: number;
  usageByModel: AIModel[];
  usageByPeriod: {
    period: string;
    credits: number;
  }[];
}

export interface AccessPermission {
  id: string;
  workflowId: string;
  userId?: string;
  teamId?: string;
  type: 'user' | 'team';
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  icon: string;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
  tags: string[];
}

export interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: 'User' | 'Admin';
  teams: string[];
}

export interface NewTeamData {
  name: string;
  color: string;
  description?: string;
}
