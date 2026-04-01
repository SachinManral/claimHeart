export type ClaimStatus = "pending" | "approved" | "denied" | "under_review";
export type AgentStatus = "pass" | "flag";
export type NotifTarget = "patient" | "hospital" | "insurer" | "all";
export type UserRole = "patient" | "hospital" | "insurer";
export type ClaimActor = "hospital" | "insurer" | "patient" | "system";
export type ClaimCaseType = "planned" | "emergency" | "day_care";

export interface TimelineEntry {
  label: string;
  time: string;
  actor: ClaimActor;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  role: UserRole;
  time: string;
  visibleTo: NotifTarget[];
}

export interface UploadedDocument {
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Claim {
  id: string;
  patientId: string;
  patientName: string;
  hospital: string;
  caseType: ClaimCaseType;
  diagnosis: string;
  icdCode: string;
  amount: number;
  status: ClaimStatus;
  riskScore: number;
  submittedAt: string;
  documents: UploadedDocument[];
  timeline: TimelineEntry[];
  aiResults: {
    policy: { status: AgentStatus; reason: string };
    medical: { status: AgentStatus; reason: string };
    cross: { status: AgentStatus; reason: string };
  };
  comments: Comment[];
  decisionNote?: string;
}

export interface Notification {
  id: string;
  targetRole: NotifTarget;
  targetUserId?: string;
  claimId?: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "action";
  read: boolean;
  time: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  patientId?: string;
  dob?: string;
  policyNumber?: string;
  insuranceCompany?: string;
  sumInsured?: number;
  doctorName?: string;
}
