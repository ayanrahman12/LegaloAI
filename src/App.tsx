import { AnimatePresence, motion } from "framer-motion";
import { Activity, Book, Bot, FileSearch, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { BrowserRouter, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { PremiumCard } from "./components/PremiumCard";
import { DashboardHome } from "./pages/DashboardHome";
import { runCopilotMessage } from "./services/gemini";
import { LegaloBackend } from "./services/legaloBackend";
import {
  ChatMessage,
  DpdpSection,
  EvidenceFile,
  GrcDataContext,
  InsightItem,
  ModuleItem,
  ObligationItem,
  StatMetric,
  TaskItem,
  TrajectoryPoint,
} from "./types";

const stats: StatMetric[] = [
  { id: "stat-1", label: "Audit Readiness", value: "92%", delta: "+4.2%", trend: "up" },
  { id: "stat-2", label: "Open Obligations", value: "18", delta: "-3", trend: "down" },
  { id: "stat-3", label: "Evidence Coverage", value: "87%", delta: "+6%", trend: "up" },
  { id: "stat-4", label: "Critical Risks", value: "3", delta: "+1", trend: "down" },
];

const trajectory: TrajectoryPoint[] = [
  { month: "Jan", score: 72, benchmark: 70 },
  { month: "Feb", score: 78, benchmark: 73 },
  { month: "Mar", score: 81, benchmark: 76 },
  { month: "Apr", score: 85, benchmark: 80 },
  { month: "May", score: 88, benchmark: 84 },
  { month: "Jun", score: 92, benchmark: 87 },
];

const insights: InsightItem[] = [
  {
    id: "insight-1",
    title: "Consent logs aligned with DPDP format",
    detail: "Consent receipts now include purpose, retention, and grievance metadata for 86% of data principals.",
    timestamp: "Updated 2 minutes ago",
    status: "Compliant",
  },
  {
    id: "insight-2",
    title: "Critical transfer impact assessment due",
    detail: "EU-to-India cross-border processing impact assessment requires board sign-off before June 30.",
    timestamp: "Triggered 18 minutes ago",
    status: "Critical",
  },
  {
    id: "insight-3",
    title: "Data breach response drill scheduled",
    detail: "Response playbook drill is scheduled with SOC and legal teams for this Friday.",
    timestamp: "Scheduled 1 hour ago",
    status: "In-Progress",
  },
  {
    id: "insight-4",
    title: "Retention policy evidence refresh",
    detail: "Retention workflows require refreshed evidence for HR and finance data stores.",
    timestamp: "Updated today",
    status: "In-Progress",
  },
];

const modules: ModuleItem[] = [
  {
    id: "module-1",
    title: "Consent Orchestration",
    summary: "Centralized consent capture, refresh, and withdrawal workflows across digital channels.",
    owner: "Data Experience",
    status: "Compliant",
  },
  {
    id: "module-2",
    title: "Breach Response",
    summary: "24/7 incident response playbook with regulator notification SLAs.",
    owner: "Security Ops",
    status: "Critical",
  },
  {
    id: "module-3",
    title: "Data Principal Rights",
    summary: "Automated DSAR intake, verification, and fulfillment workflows.",
    owner: "Privacy Office",
    status: "In-Progress",
  },
  {
    id: "module-4",
    title: "Processor Oversight",
    summary: "Third-party processor inventory and contractual readiness monitoring.",
    owner: "Vendor Risk",
    status: "Compliant",
  },
  {
    id: "module-5",
    title: "Retention Engine",
    summary: "Rule-based retention schedules mapped to business unit policies.",
    owner: "Data Governance",
    status: "In-Progress",
  },
  {
    id: "module-6",
    title: "Security Baseline",
    summary: "Continuous control monitoring aligned to DPDP security safeguards.",
    owner: "Cyber Defense",
    status: "Compliant",
  },
];

const obligations: ObligationItem[] = [
  {
    id: "OBL-001",
    title: "Data fiduciary accountability",
    chapter: "Chapter III",
    owner: "Chief Privacy Officer",
    due: "2024-06-30",
    progress: 92,
    risk: "Compliant",
    summary: "Maintain accountable data processing records and fiduciary oversight controls.",
  },
  {
    id: "OBL-002",
    title: "Consent management audit",
    chapter: "Chapter II",
    owner: "Legal Counsel",
    due: "2024-07-04",
    progress: 68,
    risk: "In-Progress",
    summary: "Validate consent capture, withdrawal, and refresh protocols for all data principals.",
  },
  {
    id: "OBL-003",
    title: "Cross-border transfer assessment",
    chapter: "Chapter IV",
    owner: "Risk Management",
    due: "2024-06-20",
    progress: 40,
    risk: "Critical",
    summary: "Document transfer impact analysis and regulator notification readiness for offshore processing.",
  },
  {
    id: "OBL-004",
    title: "Grievance redressal SLA",
    chapter: "Chapter III",
    owner: "Customer Experience",
    due: "2024-06-25",
    progress: 76,
    risk: "In-Progress",
    summary: "Ensure grievance redressal workflows meet mandated turnaround times.",
  },
  {
    id: "OBL-005",
    title: "Data minimization controls",
    chapter: "Chapter II",
    owner: "Data Governance",
    due: "2024-07-11",
    progress: 84,
    risk: "Compliant",
    summary: "Enforce purpose limitation and minimization on all collection endpoints.",
  },
  {
    id: "OBL-006",
    title: "Breach notification drill",
    chapter: "Chapter V",
    owner: "Security Operations",
    due: "2024-06-18",
    progress: 52,
    risk: "Critical",
    summary: "Conduct a breach notification tabletop exercise with regulators and stakeholders.",
  },
  {
    id: "OBL-007",
    title: "Data retention mapping",
    chapter: "Chapter II",
    owner: "Records Management",
    due: "2024-07-02",
    progress: 70,
    risk: "In-Progress",
    summary: "Map retention schedules to approved deletion and archival workflows.",
  },
  {
    id: "OBL-008",
    title: "Processor contract alignment",
    chapter: "Chapter IV",
    owner: "Vendor Risk",
    due: "2024-07-15",
    progress: 88,
    risk: "Compliant",
    summary: "Update processor agreements with DPDP mandatory clauses.",
  },
];

const defaultEvidence: EvidenceFile[] = [
  {
    id: "EVD-101",
    name: "Consent Ledger Snapshot",
    category: "Consent",
    owner: "Privacy Ops",
    status: "Approved",
    version: "v4.2",
    updatedAt: "2024-06-08",
  },
  {
    id: "EVD-102",
    name: "Transfer Impact Assessment",
    category: "Cross-Border",
    owner: "Risk Team",
    status: "Pending",
    version: "v1.0",
    updatedAt: "2024-06-10",
  },
  {
    id: "EVD-103",
    name: "Breach Response Playbook",
    category: "Incident",
    owner: "Security Ops",
    status: "Approved",
    version: "v3.6",
    updatedAt: "2024-06-06",
  },
  {
    id: "EVD-104",
    name: "Retention Policy Matrix",
    category: "Retention",
    owner: "Data Governance",
    status: "Pending",
    version: "v2.1",
    updatedAt: "2024-06-07",
  },
  {
    id: "EVD-105",
    name: "Data Principal Rights Workflow",
    category: "Rights",
    owner: "Customer Success",
    status: "Approved",
    version: "v5.0",
    updatedAt: "2024-06-09",
  },
  {
    id: "EVD-106",
    name: "Grievance Redressal SLA",
    category: "Grievance",
    owner: "Support Ops",
    status: "Rejected",
    version: "v1.4",
    updatedAt: "2024-06-05",
  },
];

const defaultTasks: TaskItem[] = [
  { id: "TASK-01", title: "Finalize transfer assessment", owner: "Risk Team", status: "Open", due: "2024-06-18" },
  { id: "TASK-02", title: "Update consent notice language", owner: "Legal", status: "In Review", due: "2024-06-19" },
  { id: "TASK-03", title: "Evidence refresh - retention", owner: "Governance", status: "Open", due: "2024-06-21" },
  { id: "TASK-04", title: "Schedule breach drill", owner: "Security Ops", status: "Open", due: "2024-06-22" },
  { id: "TASK-05", title: "DSAR automation QA", owner: "Privacy Office", status: "Closed", due: "2024-06-14" },
];

const dpdpSectionTitles = [
  "Short title, extent, and commencement",
  "Definitions",
  "Application of the Act",
  "Exemptions and lawful purposes",
  "Consent requirements",
  "Notice obligations",
  "Consent withdrawal",
  "Obligations of data fiduciaries",
  "Data minimization",
  "Storage limitation",
  "Data accuracy and integrity",
  "Grievance redressal",
  "Data principal rights",
  "Right to access information",
  "Right to correction",
  "Right to erasure",
  "Right to nominate",
  "Processing of children data",
  "Significant data fiduciary duties",
  "Privacy by design",
  "Cross-border transfer safeguards",
  "Security safeguards",
  "Breach notification",
  "Data protection impact assessment",
  "Record keeping requirements",
  "Appointment of DPO",
  "Processor obligations",
  "Third-party contract clauses",
  "Consent manager provisions",
  "Data principal verification",
  "Consent manager registration",
  "Voluntary undertakings",
  "Penalties and adjudication",
  "Compensation for data principals",
  "Appellate authority",
  "Cross-border processing rules",
  "Establishment of Data Protection Board",
  "Board powers",
  "Board procedures",
  "Digital governance principles",
  "Rule-making powers",
  "Delegation of powers",
  "Power to remove difficulties",
  "Repeal and savings",
];

const dpdpSections: DpdpSection[] = dpdpSectionTitles.map((title, index) => {
  const sectionNumber = index + 1;
  let chapter = "Chapter I";
  if (sectionNumber > 4 && sectionNumber <= 10) chapter = "Chapter II";
  if (sectionNumber > 10 && sectionNumber <= 18) chapter = "Chapter III";
  if (sectionNumber > 18 && sectionNumber <= 23) chapter = "Chapter IV";
  if (sectionNumber > 23 && sectionNumber <= 32) chapter = "Chapter V";
  if (sectionNumber > 32 && sectionNumber <= 36) chapter = "Chapter VI";
  if (sectionNumber > 36 && sectionNumber <= 40) chapter = "Chapter VII";
  if (sectionNumber > 40) chapter = "Chapter VIII";
  return {
    id: `DPDP-${sectionNumber}`,
    chapter,
    section: `Section ${sectionNumber}`,
    title,
    summary: `Guidance for ${title.toLowerCase()} under the DPDP Act compliance framework.`,
  };
});

const statusBadgeStyles: Record<string, string> = {
  Compliant: "bg-emerald-500/15 text-emerald-400",
  Critical: "bg-rose-500/15 text-rose-400",
  "In-Progress": "bg-amber-500/15 text-amber-400",
};

const statusLabelStyles: Record<string, string> = {
  Approved: "bg-emerald-500/15 text-emerald-400",
  Pending: "bg-amber-500/15 text-amber-400",
  Rejected: "bg-rose-500/15 text-rose-400",
};

const CopilotDrawer = ({
  open,
  onClose,
  context,
  backend,
}: {
  open: boolean;
  onClose: () => void;
  context: GrcDataContext;
  backend: LegaloBackend;
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => backend.getChatHistory());
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    backend.addChatMessage(userMessage);
    setInput("");
    setLoading(true);
    const responseText = await runCopilotMessage(userMessage.content, context);
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: responseText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    backend.addChatMessage(assistantMessage);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          className="fixed right-6 top-6 z-50 flex h-[calc(100vh-3rem)] w-full max-w-md flex-col rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 shadow-[0_40px_90px_rgba(15,23,42,0.85)] backdrop-blur"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Compliance Copilot</p>
              <h3 className="text-xl font-black tracking-tight text-white">Gemini Analyst</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
            >
              Close
            </button>
          </div>
          <div className="mt-6 flex-1 space-y-3 overflow-y-auto pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl border border-slate-800/70 p-4 text-sm ${
                  message.role === "user"
                    ? "bg-blue-500/10 text-blue-100"
                    : "bg-slate-900/70 text-slate-200"
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  {message.role === "user" ? "You" : "Copilot"}
                </p>
                <p className="mt-2 whitespace-pre-line text-sm">{message.content}</p>
              </div>
            ))}
            {loading ? (
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 text-sm text-slate-400">
                Copilot is analyzing with GrcData tools...
              </div>
            ) : null}
          </div>
          <div className="mt-4 space-y-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={3}
              placeholder="Ask about compliance score, obligations, or evidence..."
              className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              onClick={handleSend}
              className="w-full rounded-2xl bg-blue-500 py-3 text-xs font-black uppercase tracking-[0.4em] text-white shadow-[0_12px_30px_rgba(59,130,246,0.4)]"
            >
              Send to Copilot
            </button>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
};

const ObligationsRegistry = ({ obligations }: { obligations: ObligationItem[] }) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(obligations[0]?.id ?? null);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return obligations.filter((item) =>
      [item.id, item.title, item.chapter, item.owner].some((value) => value.toLowerCase().includes(term))
    );
  }, [obligations, search]);

  const selected = obligations.find((item) => item.id === selectedId);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Obligations Registry</p>
          <h2 className="text-3xl font-black tracking-tight text-white">DPDP Obligation Control Room</h2>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          {filtered.length} active obligations
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
            <FileSearch className="h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter obligations by title, owner, or chapter"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800/80 bg-slate-950/90 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Obligation</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer border-b border-slate-800/70 transition hover:bg-slate-900/60 ${
                      selectedId === item.id ? "bg-slate-900/80" : "bg-transparent"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{item.id}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{item.owner}</td>
                    <td className="px-4 py-4 text-slate-400">{item.due}</td>
                    <td className="px-4 py-4">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                        {item.progress}%
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] ${
                          statusBadgeStyles[item.risk]
                        }`}
                      >
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.aside
              key={selected.id}
              className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.75)]"
              initial={{ x: 40, opacity: 0, rotateY: 12 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: 40, opacity: 0, rotateY: 12 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Detail View</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-white">{selected.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{selected.summary}</p>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Owner</p>
                  <p className="text-sm text-white">{selected.owner}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Chapter</p>
                  <p className="text-sm text-white">{selected.chapter}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Due Date</p>
                  <p className="text-sm text-white">{selected.due}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Progress</p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${selected.progress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{selected.progress}% completion</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Risk Signal</p>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] ${
                      statusBadgeStyles[selected.risk]
                    }`}
                  >
                    {selected.risk}
                  </span>
                </div>
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const EvidenceVault = ({ evidence }: { evidence: EvidenceFile[] }) => {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return evidence.filter((file) =>
      [file.name, file.category, file.owner].some((value) => value.toLowerCase().includes(term))
    );
  }, [evidence, search]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Evidence Vault</p>
          <h2 className="text-3xl font-black tracking-tight text-white">Legal Proof Repository</h2>
        </div>
        <span className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          {filtered.length} files
        </span>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
        <FileSearch className="h-4 w-4 text-slate-500" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search evidence by name, category, or owner"
          className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {filtered.map((file) => (
          <PremiumCard key={file.id}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{file.name}</p>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] ${
                    statusLabelStyles[file.status]
                  }`}
                >
                  {file.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">Category · {file.category}</p>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-slate-500">
                <span>Version {file.version}</span>
                <span>Updated {file.updatedAt}</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Owner · {file.owner}</p>
            </div>
          </PremiumCard>
        ))}
      </div>
    </motion.div>
  );
};

const DpdpLibrary = ({ sections }: { sections: DpdpSection[] }) => {
  const chapters = useMemo(() => {
    return sections.reduce<Record<string, DpdpSection[]>>((acc, section) => {
      acc[section.chapter] = acc[section.chapter] ?? [];
      acc[section.chapter].push(section);
      return acc;
    }, {});
  }, [sections]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">DPDP Library</p>
        <h2 className="text-3xl font-black tracking-tight text-white">India DPDP Act Knowledge Base</h2>
      </div>
      <div className="grid gap-6">
        {Object.entries(chapters).map(([chapter, items]) => (
          <PremiumCard key={chapter} title={chapter}>
            <div className="space-y-4">
              {items.map((section) => (
                <div key={section.id} className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{section.title}</p>
                    <span className="rounded-full border border-slate-800/80 bg-slate-900/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                      {section.section}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{section.summary}</p>
                </div>
              ))}
            </div>
          </PremiumCard>
        ))}
      </div>
    </motion.div>
  );
};

const SidebarLink = ({ to, icon: Icon, label }: { to: string; icon: typeof LayoutDashboard; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        isActive ? "bg-blue-500/15 text-blue-100" : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
      }`
    }
  >
    <Icon className="h-5 w-5" />
    {label}
  </NavLink>
);

const Shell = () => {
  const location = useLocation();
  const backend = useMemo(() => new LegaloBackend(), []);
  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    const storedEvidence = backend.getEvidence();
    const storedTasks = backend.getTasks();
    if (!storedEvidence.length) {
      backend.setEvidence(defaultEvidence);
      setEvidence(defaultEvidence);
    } else {
      setEvidence(storedEvidence);
    }
    if (!storedTasks.length) {
      backend.setTasks(defaultTasks);
      setTasks(defaultTasks);
    } else {
      setTasks(storedTasks);
    }
  }, [backend]);

  const grcContext: GrcDataContext = useMemo(
    () => ({ obligations, tasks, evidence }),
    [evidence, tasks]
  );

  return (
    <div className="min-h-screen bg-[#0a0f18] font-['Plus_Jakarta_Sans'] text-white">
      <div className="flex">
        <aside className="fixed left-0 top-0 h-screen w-72 border-r border-slate-800/80 bg-slate-950/80 p-6">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">LegaloAI</p>
              <h1 className="text-2xl font-black tracking-tight text-white">Command Center</h1>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Operational Core</p>
              <nav className="space-y-2">
                <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
                <SidebarLink to="/obligations" icon={ShieldCheck} label="Obligations" />
                <SidebarLink to="/evidence" icon={FileSearch} label="Evidence Vault" />
                <SidebarLink to="/library" icon={Book} label="DPDP Library" />
              </nav>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Audit Readiness</p>
              <p className="mt-3 text-3xl font-black tracking-tight text-white">92%</p>
              <p className="mt-1 text-xs text-slate-400">Last updated 2 hours ago</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[92%] rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </aside>

        <div className="ml-72 flex-1">
          <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Status</p>
                <p className="text-sm text-slate-300">DPDP Act command readiness live</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-2xl border border-slate-800/80 bg-slate-900/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Risk Snapshot
              </button>
              <button
                onClick={() => setCopilotOpen(true)}
                className="flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-[0_12px_30px_rgba(59,130,246,0.4)]"
              >
                <Bot className="h-4 w-4" />
                Copilot
              </button>
            </div>
          </header>
          <main className="bg-gradient-to-b from-[#0a0f18] to-[#0f172a] px-10 py-10">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<DashboardHome stats={stats} trajectory={trajectory} insights={insights} modules={modules} />} />
                <Route path="/obligations" element={<ObligationsRegistry obligations={obligations} />} />
                <Route path="/evidence" element={<EvidenceVault evidence={evidence} />} />
                <Route path="/library" element={<DpdpLibrary sections={dpdpSections} />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <CopilotDrawer open={copilotOpen} onClose={() => setCopilotOpen(false)} context={grcContext} backend={backend} />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
};
