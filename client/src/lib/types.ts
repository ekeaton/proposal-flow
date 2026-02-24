type ProposalLineItem = {
  id: string;
  proposalId: string;
  description: string;
  quantity: number;
  rate: number;
};

export const ProposalStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export type ProposalStatus =
  (typeof ProposalStatus)[keyof typeof ProposalStatus];

export type Proposal = {
  id: string;
  userId: string;
  clientCompany: string;
  clientContactName: string;
  clientContactEmail: string;
  engagementType: string;
  duration: number;
  status: ProposalStatus;
  totalAmount: number;
  proposalLineItems: ProposalLineItem[];
};

type StatusCount = {
  pending: number;
  accepted: number;
  rejected: number;
};

export type Dashboard = {
  totalProposals: number;
  totalRevenue: number;
  averageValue: number;
  statusCounts: StatusCount;
};
