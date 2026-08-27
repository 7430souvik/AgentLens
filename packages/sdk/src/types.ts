export type AgentLensEvent = {
    name: string;
    type: string;

    model?: string;
    status?: string;

    duration?: number;

    inputTokens?: number;
    outputTokens?: number;

    cost?: number;

    payload?: unknown;
    output?: unknown;

    errorMessage?: string;
    errorStack?: string;

    traceId?: string;
    spanId?: string;
};