export interface TenantAdmin {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Super Admin';
}

export interface Tenant {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  totalUsers: number;
  activeUsers: number;
  tokensUsed: number;
  tokensLimit: number;
  admins: TenantAdmin[];
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface TenantAssignment {
  tenantId: string;
  tenantName: string;
  visibility: 'admin-only' | 'organization';
}

export interface AssistantWorkflow {
  id: string;
  name: string;
  type: 'assistant' | 'workflow';
  description: string;
  assignments: TenantAssignment[];
}

export interface PlatformPost {
  id: string;
  title: string;
  content: string;
  type: string;
  targetType: 'all' | 'specific';
  targetTenants: string[];
  createdAt: string;
  author: string;
}
