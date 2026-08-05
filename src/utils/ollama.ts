export async function verifyOllama(url = "http://localhost:11434") {
  try {
    const response = await fetch(`${url}/api/tags`);

    if (!response.ok) {
      throw new Error("Unable to establish connection to LLM Model");
    }
  } catch {
    throw new Error(
`Unable to connect to Ollama.

Expected server:
${url}

Start it using:
  ollama serve

Then verify:
  ollama list`
    );
  }
}