"use client";

import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  RefreshCcw,
  Send,
  Sparkles,
  User,
  Volume2,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import type {
  VoiceMessage,
  VoiceUrgency,
} from "@/types/voice";

import { askVoiceAssistant } from "@/lib/geminiVoice";

type SpeechRecognitionResultEventLike = Event & {
  results: SpeechRecognitionResultList;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;

  onresult:
    | ((event: SpeechRecognitionResultEventLike) => void)
    | null;

  onerror:
    | ((event: Event & { error?: string }) => void)
    | null;

  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const QUICK_QUESTIONS = [
  "What are the symptoms of dengue?",
  "What does HbA1c mean?",
  "Why am I having a headache?",
  "What should I do for a fever?",
];

const LANGUAGES = [
  {
    label: "English (India)",
    value: "en-IN",
  },
  {
    label: "English",
    value: "en-US",
  },
  {
    label: "Hindi",
    value: "hi-IN",
  },
  {
    label: "Marathi",
    value: "mr-IN",
  },
];

function createMessage(
  role: "user" | "assistant",
  content: string,
  extra?: Partial<VoiceMessage>
): VoiceMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    timestamp: Date.now(),
    ...extra,
  };
}

function urgencyLabel(urgency: VoiceUrgency) {
  switch (urgency) {
    case "emergency":
      return "Emergency";
    case "urgent":
      return "Urgent";
    case "attention":
      return "Needs Attention";
    default:
      return "General Guidance";
  }
}

function urgencyClasses(urgency: VoiceUrgency) {
  switch (urgency) {
    case "emergency":
      return "border-red-200 bg-red-50 text-red-700";
    case "urgent":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "attention":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-sky-200 bg-sky-50 text-sky-700";
  }
}

export function VoiceAssistant() {
  const [messages, setMessages] = useState<VoiceMessage[]>([
    createMessage(
      "assistant",
      "Hi! I'm your MedAI health assistant. Ask me anything about symptoms, medicines, reports, health conditions, or general health information."
    ),
  ]);

  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [error, setError] = useState("");

  const recognitionRef =
    useRef<BrowserSpeechRecognition | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, processing]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = () => {
    setError("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge, or type your question below."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.results.length - 1;
        i >= 0;
        i--
      ) {
        const result = event.results[i];

        if (!result || result.length === 0) {
          continue;
        }

        const text = result[0]?.transcript || "";

        if (result.isFinal) {
          finalText =
            `${text} ${finalText}`.trim();
        } else {
          interimText =
            `${text} ${interimText}`.trim();
        }
      }

      if (finalText) {
        setInput((previous) =>
          `${previous} ${finalText}`.trim()
        );
      }

      setLiveTranscript(interimText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);

      setListening(false);
      setLiveTranscript("");

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission was denied. Please allow microphone access and try again."
        );
      } else if (event.error === "no-speech") {
        setError(
          "I couldn't hear anything. Please try speaking again."
        );
      } else {
        setError(
          "Voice input stopped unexpectedly. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setListening(false);
      setLiveTranscript("");
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setListening(true);
    } catch (error) {
      console.error(error);
      setListening(false);
      setError("Unable to start the microphone.");
    }
  };

  const sendQuestion = async (question?: string) => {
    const text = (question ?? input).trim();

    if (!text || processing) {
      return;
    }

    setError("");
    setLiveTranscript("");
    setInput("");

    const userMessage = createMessage("user", text);

    const nextMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(nextMessages);
    setProcessing(true);

    try {
      const response = await askVoiceAssistant({
        messages: nextMessages
          .filter(
            (message) =>
              message.role === "user" ||
              message.role === "assistant"
          )
          .map((message) => ({
            role: message.role,
            content: message.content,
          })),
      });

      const assistantMessage = createMessage(
        "assistant",
        response.reply,
        {
          urgency: response.urgency,
          emergencySigns: response.emergencySigns,
        }
      );

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to get an answer."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await sendQuestion();
  };

  const clearConversation = () => {
    if (processing) {
      return;
    }

    setMessages([
      createMessage(
        "assistant",
        "Conversation cleared. What would you like to know about your health?"
      ),
    ]);

    setInput("");
    setError("");
    setLiveTranscript("");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f8fafc_42%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <section className="mb-6 overflow-hidden rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200">
                <Bot size={28} />

                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    MedAI Voice Assistant
                  </h1>

                  <Sparkles
                    size={18}
                    className="text-sky-500"
                  />
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Ask your health question and get a quick AI response.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                aria-label="Voice language"
              >
                {LANGUAGES.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearConversation}
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCcw size={15} />
                New chat
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Chat */}
          <section className="flex min-h-[680px] flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/85 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            {/* Chat header */}
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    Health conversation
                  </p>

                  <p className="text-xs text-slate-500">
                    Ask naturally. You can ask follow-up questions.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  AI ready
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
              {messages.map((message) => {
                const isUser =
                  message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                        <Bot size={18} />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] ${
                        isUser
                          ? "items-end"
                          : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                          isUser
                            ? "rounded-br-md bg-sky-500 text-white shadow-lg shadow-sky-100"
                            : "rounded-bl-md border border-slate-100 bg-slate-50 text-slate-700"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>

                      {!isUser &&
                        message.urgency &&
                        message.urgency !==
                          "normal" && (
                          <div
                            className={`mt-2 rounded-xl border px-3 py-2 text-xs font-semibold ${urgencyClasses(
                              message.urgency
                            )}`}
                          >
                            {message.urgency ===
                              "emergency" && (
                              <div className="mb-1 flex items-center gap-2">
                                <AlertTriangle
                                  size={14}
                                />
                                <span>
                                  Emergency warning
                                </span>
                              </div>
                            )}

                            {urgencyLabel(
                              message.urgency
                            )}

                            {message.emergencySigns &&
                              message.emergencySigns
                                .length > 0 && (
                                <ul className="mt-2 space-y-1 font-normal">
                                  {message.emergencySigns.map(
                                    (sign, index) => (
                                      <li
                                        key={`${message.id}-sign-${index}`}
                                      >
                                        • {sign}
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                          </div>
                        )}

                      <p
                        className={`mt-1 px-1 text-[10px] ${
                          isUser
                            ? "text-right text-slate-400"
                            : "text-slate-400"
                        }`}
                      >
                        {new Date(
                          message.timestamp
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {isUser && (
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <User size={18} />
                      </div>
                    )}
                  </div>
                );
              })}

              {processing && (
                <div className="flex gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <Bot size={18} />
                  </div>

                  <div className="rounded-2xl rounded-bl-md border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2
                        size={16}
                        className="animate-spin text-sky-500"
                      />

                      <span className="text-sm text-slate-500">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Live speech */}
            {listening && (
              <div className="mx-4 mb-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 sm:mx-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white">
                    <Mic size={17} />

                    <span className="absolute inset-0 animate-ping rounded-full bg-sky-400 opacity-30" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-sky-600">
                      Listening
                    </p>

                    <p className="truncate text-sm text-slate-600">
                      {liveTranscript ||
                        "Speak your question..."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mx-4 mb-3 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <div className="flex-1">
                  {error}
                </div>

                <button
                  type="button"
                  onClick={() => setError("")}
                  aria-label="Close error"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-slate-100 p-4 sm:p-5">
              <form
                onSubmit={handleSubmit}
                className="flex items-end gap-2"
              >
                <button
                  type="button"
                  onClick={startListening}
                  disabled={processing}
                  aria-label={
                    listening
                      ? "Stop listening"
                      : "Start voice input"
                  }
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
                    listening
                      ? "bg-red-500 text-white shadow-lg shadow-red-100"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {listening ? (
                    <MicOff size={20} />
                  ) : (
                    <Mic size={20} />
                  )}
                </button>

                <div className="relative flex-1">
                  <textarea
                    value={input}
                    onChange={(event) =>
                      setInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        if (!processing) {
                          void sendQuestion();
                        }
                      }
                    }}
                    rows={1}
                    placeholder="Ask your health question..."
                    className="min-h-12 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    disabled={processing}
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    !input.trim() || processing
                  }
                  aria-label="Send question"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-100 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {processing ? (
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={19} />
                  )}
                </button>
              </form>

              <p className="mt-2 text-center text-[11px] text-slate-400">
                Press Enter to send • Shift + Enter for a new line
              </p>
            </div>
          </section>

          {/* Side panel */}
          <aside className="space-y-5">
            {/* Quick questions */}
            <section className="rounded-[26px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <MessageCircle size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Quick questions
                  </h2>

                  <p className="text-xs text-slate-500">
                    Try one instantly
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {QUICK_QUESTIONS.map(
                  (question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() =>
                        void sendQuestion(question)
                      }
                      disabled={processing}
                      className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-left text-sm text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {question}
                    </button>
                  )
                )}
              </div>
            </section>

            {/* Voice */}
            <section className="overflow-hidden rounded-[26px] border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sky-500 shadow-sm">
                  {listening ? (
                    <Volume2 size={21} />
                  ) : (
                    <Mic size={21} />
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Voice input
                  </h2>

                  <p className="text-xs text-slate-500">
                    Speak naturally
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={startListening}
                disabled={processing}
                className={`w-full rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  listening
                    ? "bg-red-500 text-white"
                    : "bg-sky-500 text-white hover:bg-sky-600"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {listening
                  ? "Stop listening"
                  : "Start speaking"}
              </button>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Voice input uses your browser microphone. Chrome
                and Edge provide the best support.
              </p>
            </section>

            {/* Safety */}
            <section className="rounded-[26px] border border-amber-100 bg-amber-50/70 p-5">
              <div className="mb-3 flex items-center gap-3">
                <CheckCircle2
                  size={19}
                  className="text-amber-600"
                />

                <h2 className="font-bold text-slate-900">
                  Health information
                </h2>
              </div>

              <p className="text-xs leading-5 text-slate-600">
                MedAI provides general health information. It
                does not replace a qualified doctor or emergency
                medical care.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}