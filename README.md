# KSU Help Chatbot

A conversational AI assistant designed to help Kennesaw State University students navigate common services and resources.

## Features
- Natural language chat interface
- Answers grounded in official KSU FAQ pages
- Multi-turn conversation support
- Source citations for transparency
- Chat logging via Supabase

## Tech Stack
- Next.js (App Router)
- TypeScript
- Supabase (PostgreSQL)
- OpenAI API
- Vercel (deployment)

## How It Works
User question → retrieve relevant FAQ + web content → LLM generates grounded response → citations returned → interaction logged

## Live Demo

## Limitations
- Limited to ingested KSU FAQ sources
- Not connected to private student data systems
- May not cover all departments or real-time updates

## Setup
```bash
npm install
npm run dev

OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

