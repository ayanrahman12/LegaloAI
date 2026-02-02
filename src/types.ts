export type ComplianceStatus = "Compliant" | "Critical" | "In-Progress";

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}

export interface TrajectoryPoint {
  month: string;
  score: number;
  benchmark: number;
}

export interface InsightItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  status: ComplianceStatus;
}

export interface ModuleItem {
  id: string;
  title: string;
  summary: string;
  owner: string;
  status: ComplianceStatus;
}

export interface ObligationItem {
  id: string;
  title: string;
  chapter: string;
  owner: string;
  due: string;
  progress: number;
  risk: ComplianceStatus;
  summary: string;
}

export interface EvidenceFile {
  id: string;
  name: string;
  category: string;
  owner: string;
  status: "Approved" | "Pending" | "Rejected";
  version: string;
  updatedAt: string;
}

export interface DpdpSection {
  id: string;
  chapter: string;
  section: string;
  title: string;
  summary: string;
}

export interface TaskItem {
  id: string;
  title: string;
  owner: string;
  status: "Open" | "In Review" | "Closed";
  due: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface GrcDataContext {
  obligations: ObligationItem[];
  tasks: TaskItem[];
  evidence: EvidenceFile[];
}
