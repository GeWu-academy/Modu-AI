export type MessageRole = "system" | "user" | "assistant" | "tool";

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  providerId: string;
  modelId: string;
  messages: ConversationMessage[];
}
