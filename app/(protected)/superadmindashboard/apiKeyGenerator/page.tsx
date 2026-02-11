"use client";

import { generateApiSecretKey } from "@/action/generateApiSecretKey";
import { useState } from "react";

export default function ApiKeyGenerator() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const key = await generateApiSecretKey();
    setApiKey(key);
    setCopied(false);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24 }}>
      <button
        onClick={handleGenerate}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          borderRadius: 6,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate API Secret Key"}
      </button>
      {apiKey && (
        <div
          style={{
            marginTop: 32,
            padding: 20,
            borderRadius: 8,
            background: "#f3f4f6",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <pre
            style={{
              margin: 0,
              fontSize: 15,
              wordBreak: "break-all",
              flex: 1,
              background: "none",
              border: "none",
            }}
          >
            {apiKey}
          </pre>
          <button
            onClick={handleCopy}
            style={{
              padding: "6px 12px",
              fontSize: 14,
              borderRadius: 5,
              background: copied ? "#22c55e" : "#e5e7eb",
              color: copied ? "#fff" : "#111",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
