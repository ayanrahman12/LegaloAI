import { ChatMessage, EvidenceFile, TaskItem } from "../types";

interface LegaloSnapshot {
  tasks: TaskItem[];
  evidence: EvidenceFile[];
  chatHistory: ChatMessage[];
}

const DEFAULT_SNAPSHOT: LegaloSnapshot = {
  tasks: [],
  evidence: [],
  chatHistory: [],
};

export class LegaloBackend {
  private storageKey = "legaloai:command-center:v1";

  constructor(private storage: Storage = window.localStorage) {}

  private loadSnapshot(): LegaloSnapshot {
    const raw = this.storage.getItem(this.storageKey);
    if (!raw) return DEFAULT_SNAPSHOT;
    try {
      return { ...DEFAULT_SNAPSHOT, ...JSON.parse(raw) } as LegaloSnapshot;
    } catch {
      return DEFAULT_SNAPSHOT;
    }
  }

  private persist(snapshot: LegaloSnapshot) {
    this.storage.setItem(this.storageKey, JSON.stringify(snapshot));
  }

  getTasks() {
    return this.loadSnapshot().tasks;
  }

  setTasks(tasks: TaskItem[]) {
    const snapshot = this.loadSnapshot();
    snapshot.tasks = tasks;
    this.persist(snapshot);
  }

  getEvidence() {
    return this.loadSnapshot().evidence;
  }

  setEvidence(evidence: EvidenceFile[]) {
    const snapshot = this.loadSnapshot();
    snapshot.evidence = evidence;
    this.persist(snapshot);
  }

  getChatHistory() {
    return this.loadSnapshot().chatHistory;
  }

  addChatMessage(message: ChatMessage) {
    const snapshot = this.loadSnapshot();
    snapshot.chatHistory = [...snapshot.chatHistory, message].slice(-50);
    this.persist(snapshot);
  }
}
