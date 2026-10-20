# SycophancyGuard

SycophancyGuard is an explainable NLP-based web application designed to detect and analyze sycophantic behavior in large language models (LLMs).

## Features

- **ChatLab:** Interact with an LLM and analyze its responses for sycophantic behavior.
- **Conversation Analysis:** Examine conversations for agreement bias and related patterns.
- **Explainability:** Review evidence supporting a detection result.
- **Model Comparison:** Compare model behavior using consistent test prompts.
- **Dataset Explorer:** Explore datasets relevant to sycophancy research.
- **Evaluation & Benchmarks:** Organize and review evaluation results.
- **Reports:** Present analysis findings in a structured format.

*Features and model integrations depend on the current project implementation and configuration.*

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Hugging Face Inference API or compatible LLM providers
- IndexedDB for local chat persistence, if configured

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- A supported LLM API token for live inference, if required

### Installation

```bash
git clone https://github.com/YOUR-USERNAME/SycophancyGuard.git
cd SycophancyGuard
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

### Configuration

Configure your supported model provider in the application's Settings. Never commit API tokens, passwords, or real environment secrets to GitHub.

## Project Status

Developed as an NLP project focused on explainable sycophancy detection in LLMs.

## License

Add your chosen license here if and when one is included in the repository.
