import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  async function createPaste() {
    if (!content.trim()) return;

    const res = await fetch("/api/paste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setUrl(data.url);
    setCopied(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Pastebin Lite</h1>

        <textarea
          placeholder="Paste your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={createPaste}>Create Paste</button>

        {url && (
          <div className="link-box">
            <a href={url} target="_blank">
              {url}
            </a>

            <button className="copy-btn" onClick={copyLink}>
              📋 {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
