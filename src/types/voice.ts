export type VoiceMessageRole = "user" | "assistant";

export type VoiceMessage = {
  id: string;
  role: VoiceMessageRole;
  content: string;
  timestamp: number;
  urgency?: VoiceUrgency;
  emergencySigns?: string[];
};

export type VoiceUrgency =
  | "normal"
  | "attention"
  | "urgent"
  | "emergency";

export type VoiceAssistantResult = {
  reply: string;
  urgency: VoiceUrgency;
  emergencySigns: string[];
  disclaimer: string;
};

export type VoiceChatRequest = {
  messages: {
    role: VoiceMessageRole;
    content: string;
  }[];
};