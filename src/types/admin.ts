
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

export interface AdminStats {
  totalUsers: number;
  totalTokensUsed: number;
  totalWorkflows: number;
  totalAssistants: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export interface AccessPermission {
  id: string;
  workflowId: string;
  userId?: string;
  teamId?: string;
  type: 'user' | 'team';
}

export interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: 'User' | 'Admin';
  teams: string[];
}
