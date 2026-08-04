# Browser AI Agent

## Description

Browser AI Agent is a command-line AI-powered browser automation framework built with TypeScript. It combines a local Large Language Model (LLM) running on Ollama with LangChain and Browser Cloud to understand natural language instructions and perform browser interactions.

The agent uses Browser Cloud to create and manage remote Playwright browser sessions while LangChain enables tool calling for browser operations such as navigation, typing, clicking, extracting information, and capturing screenshots.

This project is designed as a modular foundation for building intelligent browser automation agents that can be extended with planning, verification, retries, memory, and additional browser tools.

---

## Tech Stack

| Category               | Technology           |
| ---------------------- | -------------------- |
| Language               | TypeScript           |
| Runtime                | Node.js              |
| AI Framework           | LangChain            |
| Local LLM              | Ollama               |
| Model                  | Qwen3:8b             |
| Browser Automation     | Playwright           |
| Browser Infrastructure | Browser Cloud        |
| Validation             | Zod                  |
| Environment Variables  | dotenv               |
| CLI                    | Node.js Readline API |

---

## Features

* Command-line interface (CLI)
* Local AI model using Ollama
* Browser Cloud integration
* Remote Playwright browser sessions
* Modular browser tools
* Natural language browser automation
* Screenshot support
* Information extraction from web pages
* Extensible architecture for additional tools

---

## Project Structure

```text
src/
│
├── agent/
│   ├── agent.ts
│   └── prompt.ts
│
├── browser/
│   ├── browser.ts
│   ├── browser-instance.ts
│   ├── browser-service.ts
│   ├── session.ts
│   └── types.ts
│
├── llm/
│   └── model.ts
│
├── models/
│   └── browser-result.ts
│
├── tools/
│   ├── navigate-tool.ts
│   ├── click-tool.ts
│   ├── fill-tool.ts
│   ├── press-tool.ts
│   ├── extract-text-tool.ts
│   ├── find-element-tool.ts
│   ├── title-tool.ts
│   ├── url-tool.ts
│   ├── screenshot-tool.ts
│   ├── close-browser-tool.ts
│   └── index.ts
│
└── index.ts
```

---

## Prerequisites

* Node.js 20+
* npm
* Ollama
* Browser Cloud by Test Mu AI credentials (LambdaTest Username and Access Key)

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd browser-ai-agent
```

Install dependencies:

```bash
npm install
```

Install and start Ollama:

```bash
ollama pull qwen3:8b
ollama serve
```

Create a `.env` file in the project root:

```env
OLLAMA_MODEL=qwen3:8b

LT_USERNAME=<your-lambdatest-username>
LT_ACCESS_KEY=<your-lambdatest-access-key>
```

---

## Build the Project

```bash
npm run build
```

---

## Run the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

---

## Example Prompt

```text
Navigate to https://https://ecommerce-playground.lambdatest.io/
Verify the Page Title
END
```

For multiline prompts, finish the input with:

```text
END
```

---

## Current Capabilities

* Navigate to web pages
* Click page elements
* Fill input fields
* Press keyboard keys
* Extract text
* Retrieve page title
* Retrieve current URL
* Capture screenshots
* Locate elements using semantic locators

---

## :question: Need Assistance?

- Discuss your queries by writing to me @ `mohammadfaisalkhatri@gmail.com`
  OR ping me on any of the social media sites using the below link:
   - [Linktree](https://linktr.ee/faisalkhatri)

## :thought_balloon: Subscribe and Follow
- [Medium Blog](https://medium.com/@iamfaisalkhatri)
- [YouTube Channel](https://www.youtube.com/@faisalkhatriqa)