import { AgentLens } from "@agentlens/sdk";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({
    path: "./apps/backend/.env",
});




const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const agentlens = new AgentLens({
    apiKey: "al_live_67984baf1f8707d821f9999ac06cbdd86e34a54a0679236eb08eb075bc01a986",
    baseUrl: "https://agentlens-backend-j3qh.onrender.com/api",
});

// const result = await agentlens.track({
//     name: "SDK Test Request",
//     type: "llm.request",
//     model: "gpt-5",
//     status: "success",
//     latency: 742,
//     inputTokens: 420,
//     outputTokens: 680,
//     cost: 0.015,
// });


const input = {
    model: "openai/gpt-oss-120b",
    messages: [
        {
            role: "user",
            content:
                "Explain what an AI agent is in two sentences.",
        },
    ],
};

const result = await agentlens.trackLLM(
    "openai/gpt-oss-120b",
    input,
    async () => {
        const response =
            await groq.chat.completions.create({
                model: "openai/gpt-oss-120b",
                messages: input.messages,
            });

        return response;
    }
);

console.log(
    "LLM response:",
    result.choices[0]?.message?.content
);