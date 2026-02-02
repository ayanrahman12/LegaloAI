import { GoogleGenerativeAI } from "@google/genai";
import { GrcDataContext, ObligationItem } from "../types";

const systemInstruction = `You are the LegaloAI Compliance Copilot for India DPDP Act Command Center.
You must NEVER hallucinate or fabricate data. Use only the provided GrcData tools to answer questions about compliance scores, obligations, tasks, and evidence.
If the request cannot be answered with GrcData, respond that the data is unavailable and suggest the closest GrcData query.`;

const getComplianceScore = (obligations: ObligationItem[]) => {
  const total = obligations.length || 1;
  const average = obligations.reduce((sum, item) => sum + item.progress, 0) / total;
  return {
    averageScore: Math.round(average),
    criticalCount: obligations.filter((item) => item.risk === "Critical").length,
    compliantCount: obligations.filter((item) => item.risk === "Compliant").length,
  };
};

const grcTools = {
  getComplianceScore: (context: GrcDataContext) => getComplianceScore(context.obligations),
  getObligationById: (context: GrcDataContext, args: { id: string }) =>
    context.obligations.find((item) => item.id === args.id) ?? null,
  searchEvidence: (context: GrcDataContext, args: { query: string }) =>
    context.evidence.filter((file) => file.name.toLowerCase().includes(args.query.toLowerCase())),
  listTasks: (context: GrcDataContext) => context.tasks,
};

const functionDeclarations = [
  {
    name: "getComplianceScore",
    description: "Returns the overall average compliance score and counts of critical and compliant obligations.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "getObligationById",
    description: "Fetch a specific obligation by its ID.",
    parameters: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "searchEvidence",
    description: "Search evidence vault items by name.",
    parameters: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "listTasks",
    description: "Return all active compliance tasks.",
    parameters: { type: "object", properties: {} },
  },
];

const runLocalFallback = (message: string, context: GrcDataContext) => {
  const lower = message.toLowerCase();
  if (lower.includes("score") || lower.includes("compliance")) {
    return `Current DPDP readiness score is ${grcTools.getComplianceScore(context).averageScore}%.`;
  }
  if (lower.includes("evidence")) {
    const results = grcTools.searchEvidence(context, { query: "" });
    return `There are ${results.length} evidence files in the vault. Ask me to search by name for more detail.`;
  }
  if (lower.includes("task")) {
    return `There are ${context.tasks.length} active tasks across compliance owners.`;
  }
  return "I can only answer using GrcData tools. Ask about compliance score, obligations, tasks, or evidence.";
};

export const runCopilotMessage = async (message: string, context: GrcDataContext) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    return runLocalFallback(message, context);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction,
    tools: [{ functionDeclarations }],
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: message }] }],
  });

  const response = result.response;
  const functionCall = response.functionCalls?.[0];
  if (functionCall) {
    const name = functionCall.name as keyof typeof grcTools;
    const args = (functionCall.args ?? {}) as Record<string, string>;
    let toolResult: unknown = null;
    if (name === "getComplianceScore") {
      toolResult = grcTools.getComplianceScore(context);
    } else if (name === "listTasks") {
      toolResult = grcTools.listTasks(context);
    } else if (name === "getObligationById") {
      toolResult = grcTools.getObligationById(context, args as { id: string });
    } else if (name === "searchEvidence") {
      toolResult = grcTools.searchEvidence(context, args as { query: string });
    }
    return `GrcData result: ${JSON.stringify(toolResult, null, 2)}`;
  }

  return response.text();
};
