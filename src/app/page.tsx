"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState("default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userText, setUserText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFullFeedback, setShowFullFeedback] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark"); // Theme state

  // Apply theme to <html> element
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
    }
  }, [theme]);

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
    <section className="flex flex-col items-center justify-center min-h-screen w-full bg-white dark:bg-gray-950 transition-colors">
      {/* Theme Toggle Button */}
      {/* <button
        className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow transition-colors"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button> */}

      <h1 className="text-2xl lg:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white transition-colors">
        Feedback AI
      </h1>
      <p className="text-lg text-gray-600 dark:text-white/35 transition-colors">
        Get roasted or praised by AI personas
      </p>

      <div className="flex flex-col gap-4 mt-6 md:w-[500px] w-full p-5 lg:p-0 ">
        <textarea
          className="bg-gray-100 dark:bg-white/5 rounded-md p-2 text-gray-900 dark:text-white/70 placeholder:text-gray-400 dark:placeholder:text-white/35 text-sm transition-colors"
          placeholder="Paste your pitch, text, or anything you want to get feedback on"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
        />

        {/* Custom Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-gray-100 dark:bg-white/5 rounded-md p-2 text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:outline-none transition-colors text-left flex justify-between items-center"
          >
            <span>
              {personasList.find((p) => p.value === selectedPersona)?.label}
            </span>
            <span className="text-gray-500 dark:text-white/50">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/10 rounded-md shadow-lg z-10 transition-colors">
              {personasList.map((persona) => (
                <button
                  key={persona.value}
                  onClick={() => {
                    setSelectedPersona(persona.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full p-2 text-left hover:bg-gray-200 dark:hover:bg-white/10 transition-colors ${
                    selectedPersona === persona.value
                      ? "bg-gray-300 dark:bg-white/20 text-gray-900 dark:text-white"
                      : "text-gray-800 dark:text-white/80"
                  } ${persona.value === "default" ? "text-gray-400 dark:text-white/50" : ""}`}
                >
                  {persona.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className={`bg-gray-100 dark:bg-white/5 rounded-md p-2 text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 focus:border-gray-400 dark:focus:border-white/30 focus:outline-none transition-colors flex justify-center items-center ${loading ? "cursor-not-allowed" : "cursor-pointer"} w-[200px] mx-auto text-center`}
          onClick={handleGetFeedback}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span>Getting feedback</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-white/60 rounded-full animate-bounce"></div>
                <div
                  className="w-1.5 h-1.5 bg-gray-400 dark:bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-gray-400 dark:bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          ) : (
            "Get Feedback"
          )}
        </button>
      </div>
      {feedback && (
        <div className="flex flex-col gap-4 mt-6 md:w-[500px] w-full p-5 lg:p-0">
          <div className="flex items-center justify-between">
            {/* persona and feedback */}
            <div className="flex items-center gap-3">
              <h3 className="text-gray-900 dark:text-white text-xl font-semibold transition-colors">Feedback</h3>
              {selectedPersona !== "default" && (
                <span className="bg-gray-200 dark:bg-white/10 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-white/70 transition-colors">
                  {selectedPersona}
                </span>
              )}
            </div>
            {/* cancel button */}
            <button
              onClick={handleCancel}
              className="text-gray-400 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/80 transition-colors text-sm"
            >
              ✕
            </button>
          </div>
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-6 text-gray-900 dark:text-white/90 border border-gray-300 dark:border-white/10 shadow-lg max-h-[400px] overflow-y-auto custom-scrollbar transition-colors">
            <div className="space-y-3">
              <div
                className={`whitespace-pre-line leading-relaxed text-gray-800 dark:text-white/80 ${
                  !showFullFeedback ? "line-clamp-5" : ""
                } transition-colors`}
                dangerouslySetInnerHTML={{
                  __html: formatFeedbackText(feedback),
                }}
              />
              {feedback.split("\n").length > 5 && (
                <button
                  onClick={() => setShowFullFeedback(!showFullFeedback)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  {showFullFeedback ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}