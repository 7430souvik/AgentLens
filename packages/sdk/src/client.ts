import type { AgentLensEvent } from "./types";

export type AgentLensOptions = {
    apiKey: string;
    baseUrl?: string;
};

export class AgentLens {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    constructor(options: AgentLensOptions) {
        if (!options.apiKey) {
            throw new Error(
                "AgentLens API key is required"
            );
        }

        this.apiKey = options.apiKey;

        this.baseUrl =
            options.baseUrl ??
            "https://agentlens-backend-j3qh.onrender.com/api";
    }

    

    
    async track(event: AgentLensEvent) {
        const response = await fetch(
            `${this.baseUrl}/ingest`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer ${this.apiKey}`,
                },

                body: JSON.stringify(event),
            }
        );

        if (!response.ok) {
            const errorText =
                await response.text();

            throw new Error(
                `AgentLens request failed (${response.status}): ${errorText}`
            );
        }

        return response.json();
    }

    async trackLLM<T>(
    model: string,
    input: unknown,
    fn: () => Promise<T>
    ): Promise<T> {
        const start = Date.now();

        try {
            const result = await fn();

            const duration = Date.now() - start;

            const usage = (result as any)?.usage;

            await this.track({
                name: `${model} Request`,
                type: "llm.request",
                model,
                status: "success",
                duration,
                inputTokens: usage?.prompt_tokens ?? null,
                outputTokens: usage?.completion_tokens ?? null,
                payload: input,
                output: (result as any)?.choices?.[0]?.message?.content ?? null,
            });

            return result;

        } catch (error) {

            const duration = Date.now() - start;

            await this.track({
                name: `${model} Request`,
                type: "llm.request",
                model,
                status: "error",
                duration,
                payload: input,
                errorMessage:
                    error instanceof Error
                        ? error.message
                        : String(error),
            });

            throw error;
        }
    }
}