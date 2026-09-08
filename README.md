# Browser AI Agent

## Description

Browser AI Agent is a command-line AI-powered browser automation framework built with TypeScript. It combines a local Large Language Model (LLM) running on Ollama with LangChain and Browser Cloud to understand natural language instructions and perform browser interactions.

The agent uses Browser Cloud to create and manage remote Playwright browser sessions, while LangChain enables tool calling for browser operations such as navigation, typing, clicking, extracting information, and capturing screenshots.

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
| Browser Infrastructure | [Browser Cloud](https://www.testmuai.com/support/docs/what-is-browser-cloud/)        |
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

## Prerequisites

* Node.js 20+
* npm
* Ollama
* Browser Cloud by TestMu AI credentials (LambdaTest Username and Access Key)

---

## Installation

Clone the repository:

```bash
git clone git@github.com:mfaisalkhatri/browser-ai-agent.git
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
LLM_TEMPERATURE=0.2
BROWSER_MODE=cloud
LT_USERNAME=<your-lambdatest-username>
LT_ACCESS_KEY=<your-lambdatest-access-key>
BROWSERCLOUD_PLATFORM_NAME=<platform name>,e.g.Windows 11
BROWSERCLOUD_BROWSER_NAME=<Browser name>, e.g Chrome
BROWSERCLOUD_BROWSER_VERSION=<Browser version>, e.g. 149
```

```env
OLLAMA_MODEL=qwen3:8b
LLM_TEMPERATURE=0.2
BROWSER_MODE=local
HEADLESS=false
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

The prompt needs to be added to the `prompt.txt` file.

### Prompt Example 1:

```text
Navigate to https://https://ecommerce-playground.lambdatest.io/
Verify the Page Title
```
### Prompt Example 2:

```text
Navigate to https://ecommerce-playground.lambdatest.io/
Enter "iPhone" into in the textbox with placeholder “Search for Products”
Click on the “Search” button next to the search field, and Wait for the results page to load
Verify the page title contains "iPhone"
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
* Get Page Content

---

## More details about Browser Cloud

[TestMu AI Browser Cloud Cookbook](https://github.com/SparshKesari/browser-cloud-cookbook) - A collection of runnable examples and patterns for [TestMu AI Browser Cloud](https://www.testmuai.com/browser-cloud/) — scalable, headless browser sessions in the cloud that work with Playwright, Puppeteer, Selenium, and AI agent frameworks.

## :question: Need Assistance?

- Discuss your queries by writing to me @ `mohammadfaisalkhatri@gmail.com`
  OR ping me on any of the social media sites using the link below:
   - [Linktree](https://linktr.ee/faisalkhatri)

## :thought_balloon: Subscribe and Follow
- [Medium Blog](https://medium.com/@iamfaisalkhatri)
- [YouTube Channel](https://www.youtube.com/@faisalkhatriqa)
