import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResponse(data.answer || "No response received");
    } catch (error) {
      console.error("Error fetching assistant response:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Demo of OpenAI Assistant API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">OpenAI Assistant API Demo</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <textarea
            className="w-full p-4 text-lg border rounded-md mb-4"
            rows={4}
            placeholder="Ask the assistant anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            disabled={loading || !input.trim()}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
        <div className="mt-8 w-full max-w-md text-left">
          {loading && <p>Processing your request...</p>}
          {response && (
            <div className="p-4 border rounded-md bg-gray-100">
              <h2 className="font-semibold text-lg mb-2">Assistant's Response:</h2>
              <p>{response}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
