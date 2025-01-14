import OpenAI from "openai";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests are allowed." });
    return;
  }

  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required in the request body." });
    return;
  }

  try {
    const assistant = await openai.beta.assistants.create({
      name: "Math Tutor",
      model: "gpt-4-1106-preview",
      instructions: "You are a math tutor that will help the user with math homework.",
      tools: [{ type: "code_interpreter" }],
    });

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    await checkStatus(thread.id, run.id);

    const messages = await openai.beta.threads.messages.list(thread.id);

    const response = messages.body.data[0]?.content[0]?.text?.value || "No response available.";

    res.status(200).json({ answer: response });
  } catch (error) {
    console.error("Error processing OpenAI API request:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
};

async function checkStatus(threadId, runId) {
  let isComplete = false;
  while (!isComplete) {
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    if (runStatus.status === "completed") {
      isComplete = true;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

export default handler;
