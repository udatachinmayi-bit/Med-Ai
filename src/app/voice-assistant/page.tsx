"use client";

import { VoiceAssistant } from "@/components/voice/VoiceAssistant";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function VoiceAssistantPage() {
  return (
    <ProtectedRoute>
      <VoiceAssistant />
    </ProtectedRoute>
  );
}