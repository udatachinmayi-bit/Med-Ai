import type {
  VoiceAssistantResult,
  VoiceChatRequest,
} from "@/types/voice";

function isValidUrgency(value: unknown): value is VoiceAssistantResult["urgency"] {
  return (
    value === "normal" ||
    value === "attention" ||
    value === "urgent" ||
    value === "emergency"
  );
}

function validateVoiceResponse(data: unknown): VoiceAssistantResult {
  const fallback: VoiceAssistantResult = {
    reply:
      "I’m sorry, I couldn’t process that question right now. Please try asking again.",
    urgency: "normal",
    emergencySigns: [],
    disclaimer:
      "This assistant provides general health information and is not a substitute for professional medical advice.",
  };

  if (!data || typeof data !== "object") {
    return fallback;
  }

  const value = data as Record<string, unknown>;

  const reply =
    typeof value.reply === "string" && value.reply.trim()
      ? value.reply.trim()
      : fallback.reply;

  const urgency = isValidUrgency(value.urgency)
    ? value.urgency
    : "normal";

  const emergencySigns = Array.isArray(value.emergencySigns)
    ? value.emergencySigns.filter(
        (item): item is string => typeof item === "string"
      )
    : [];

  const disclaimer =
    typeof value.disclaimer === "string" && value.disclaimer.trim()
      ? value.disclaimer.trim()
      : fallback.disclaimer;

  return {
    reply,
    urgency,
    emergencySigns,
    disclaimer,
  };
}

export async function askVoiceAssistant(
  request: VoiceChatRequest
): Promise<VoiceAssistantResult> {
  const response = await fetch("/api/voice-assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : "Unable to get an answer."
    );
  }

  return validateVoiceResponse(data);
}