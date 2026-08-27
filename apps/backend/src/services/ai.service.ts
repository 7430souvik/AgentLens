import OpenAI from "openai";



const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL:"https://api.groq.com/openai/v1",
});

type EventForAnalysis = {
    name: string;
    type: string;
    status: string | null;
    duration: number | null;
    model: string | null;
    inputTokens:  number | null;
    outputTokens: number | null;
    errorMessage: string |  null;
    payload: any;
};

export const analyzeEvent = async ( event: EventForAnalysis) =>{
    if(!process.env.GROQ_API_KEY){
        throw new Error(
            "GROQ_API_KEY is not configured"
        );
    }

      const prompt = `
    Analyze this AI application event.

    Event:
    ${JSON.stringify(event, null, 2)}

    Return ONLY valid JSON with exactly these fields:

    {
    "summary": "What happened",
    "rootCause": "Likely root cause",
    "impact": "Impact on the application or user",
    "recommendation": "Recommended fix",
    "severity": "low | medium | high | critical"
    }

    Do not use markdown.
    Do not wrap the JSON in code fences.
    `;

    const response = await openai.chat.completions.create({
        model:"openai/gpt-oss-120b",
        messages: [
            {
                role:"system",
                content: "you are an expert AI observability engineer."
            },

            {
                role:"user",
                content: prompt,
            },
        ],
    });

    
    const content =
        response.choices[0]?.message?.content;

    if (!content) {
        throw new Error(
            "No AI analysis returned"
        );
    }

    try {
        return JSON.parse(content);
    } catch (error) {
        console.error(
            "AI JSON PARSE ERROR:",
            content
        );

        throw new Error(
            "AI returned invalid JSON"
        );
    }
};