"use client";

import Image from "next/image";
import { useState } from "react";
import { personas } from "@/utils/persona";

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState("default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userText, setUserText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFullFeedback, setShowFullFeedback] = useState(false);

  const personasList = [
    { value: "default", label: "Select a persona" },
    { value: "Gen Z", label: "Gen Z" },
    { value: "Investor", label: "Investor" },
    { value: "Bestie", label: "Bestie" },
    { value: "Auntie", label: "Auntie" },
    { value: "Twitter Bro", label: "Twitter Bro" },
  ];

  const handleGetFeedback = async () => {
    if (!userText.trim() || selectedPersona === "default") return;

    setLoading(true);
    setFeedback("");
    setShowFullFeedback(false);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText, persona: selectedPersona }),
      });
      const data = await response.json();
      setFeedback(data.feedback || "No feedback received.");
    } catch (error) {
      setFeedback("Something went wrong while getting feedback.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFeedback("");
    setShowFullFeedback(false);
  };

  const formatFeedbackText = (text: string) => {
    // Convert *text* to bold
    const formattedText = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
    return formattedText;
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-semibold tracking-tight ">
        Cracked Feedback
      </h1>
      <p className="text-lg text-white/35 ">
        Get roasted or praised by AI personas
      </p>

      <div className="flex flex-col gap-4 mt-10 w-[500px]">
        <textarea
          className="bg-white/5 rounded-md p-2 text-white/35 text-sm"
          placeholder="Paste your pitch, text, or anything you want to get feedback on"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
        />

        {/* Custom Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white/5 rounded-md p-2 text-white border border-white/10 focus:border-white/30 focus:outline-none transition-colors text-left flex justify-between items-center"
          >
            <span>
              {personasList.find((p) => p.value === selectedPersona)?.label}
            </span>
            <span className="text-white/50">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-white/10 rounded-md shadow-lg z-10">
              {personasList.map((persona) => (
                <button
                  key={persona.value}
                  onClick={() => {
                    setSelectedPersona(persona.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full p-2 text-left hover:bg-white/10 transition-colors ${
                    selectedPersona === persona.value
                      ? "bg-white/20 text-white"
                      : "text-white/80"
                  } ${persona.value === "default" ? "text-white/50" : ""}`}
                >
                  {persona.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="bg-white/5 rounded-md p-2 text-white border border-white/10 focus:border-white/30 focus:outline-none transition-colors flex justify-center items-center cursor-pointer w-[200px] mx-auto text-center  "
          onClick={handleGetFeedback}
        >
          {loading ? "Getting feedback..." : "Get Feedback"}
        </button>
      </div>
      {feedback && (
        <div className="flex flex-col gap-4 mt-6 w-[500px] ">
          <div className="flex items-center justify-between">
            {/* persona and feedback */}
            <div className="flex items-center gap-3">
              <h3 className="text-white text-xl font-semibold">Feedback</h3>
              {selectedPersona !== "default" && (
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/70">
                  {selectedPersona}
                </span>
              )}
            </div>
            {/* cancel button */}
            <button
              onClick={handleCancel}
              className="text-white/50 hover:text-white/80 transition-colors text-sm"
            >
              ✕
            </button>
          </div>
          <div className="bg-white/5 rounded-lg p-6 text-white/90 border border-white/10 shadow-lg max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating feedback...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className={`whitespace-pre-line leading-relaxed text-white/80 ${
                    !showFullFeedback ? "line-clamp-5" : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatFeedbackText(feedback),
                  }}
                />
                {feedback.split("\n").length > 5 && (
                  <button
                    onClick={() => setShowFullFeedback(!showFullFeedback)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {showFullFeedback ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
