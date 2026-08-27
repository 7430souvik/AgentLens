import { useNavigate } from "react-router-dom";

export default function Docs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111318] text-white">
      {/* Navbar */}
      <nav className="border-b border-[#2A2F3A] bg-[#111318]">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-6">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex cursor-pointer items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA] font-bold text-[#111318]">
              A
            </div>
            <span className="text-xl font-bold">AgentLens</span>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-[#2A2F3A] px-4 py-2 text-sm hover:bg-[#181B22]"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-[1200px] px-6 py-10">
        {/* Hero */}
        <section className="mb-14">
          <p className="mb-3 text-sm text-[#A78BFA]">Documentation</p>
          <h1 className="text-5xl font-bold tracking-tight">
            Instrument your AI apps in minutes.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#8B93A7]">
            Track LLM requests, latency, tokens, costs and errors with one SDK.
            Then visualize everything inside AgentLens.
          </p>
        </section>

        {/* Quick Start */}
        <section className="mb-14 rounded-2xl border border-[#2A2F3A] bg-[#181B22] p-8">
          <h2 className="mb-6 text-2xl font-semibold">Quick Start</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Step
              number="1"
              title="Install SDK"
              text="Add AgentLens to your project."
            />
            <Step
              number="2"
              title="Initialize"
              text="Connect using your API key."
            />
            <Step
              number="3"
              title="Track Events"
              text="Automatically capture LLM calls."
            />
          </div>
        </section>

        {/* Install */}
        <DocSection
          title="Install the SDK"
          description="Install the AgentLens SDK from npm."
        >
          <Code>{`npm install @agentlens/sdk`}</Code>
        </DocSection>

        {/* Initialize */}
        <DocSection
          title="Initialize AgentLens"
          description="Create a client once and reuse it across your application."
        >
          <Code>{`import { AgentLens } from "@agentlens/sdk";

const agentlens = new AgentLens({
  apiKey: process.env.AGENTLENS_API_KEY!,
  baseUrl: "https://api.agentlens.dev"
});`}</Code>
        </DocSection>

        {/* Track Custom Event */}
        <DocSection
          title="Track a Custom Event"
          description="Send any AI or backend event to AgentLens."
        >
          <Code>{`await agentlens.track({
  name: "Vector Search",
  type: "tool.call",
  status: "success",
  latency: 143,
  payload: {
    query: "best YC startups"
  }
});`}</Code>
        </DocSection>

        {/* LLM Tracking */}
        <DocSection
          title="Track LLM Requests Automatically"
          description="Wrap your provider call and AgentLens captures latency, status, tokens and output."
        >
          <Code>{`const result = await agentlens.trackLLM(
  "openai/gpt-oss-120b",
  async () => {
    return await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: "Explain AI agents in two sentences."
        }
      ]
    });
  }
);`}</Code>
        </DocSection>

        {/* Dashboard Features */}
        <DocSection
          title="What gets captured?"
          description="Every tracked request becomes an observable event."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Feature
              title="Latency"
              value="742ms"
              desc="End-to-end request timing"
            />
            <Feature
              title="Tokens"
              value="420 → 680"
              desc="Prompt & completion usage"
            />
            <Feature
              title="Model"
              value="gpt-oss-120b"
              desc="LLM provider & model name"
            />
            <Feature
              title="Status"
              value="Success / Error"
              desc="Production reliability tracking"
            />
          </div>
        </DocSection>

        {/* Event Flow */}
        <DocSection
          title="How AgentLens works"
          description="A complete request lifecycle."
        >
          <div className="rounded-xl border border-[#2A2F3A] bg-[#111318] p-6">
            <div className="flex flex-col items-center gap-3 text-center text-sm">
              <Flow label="Your App" />
              <Arrow />
              <Flow label="AgentLens SDK" />
              <Arrow />
              <Flow label="AgentLens API" />
              <Arrow />
              <Flow label="PostgreSQL" />
              <Arrow />
              <Flow label="Dashboard & AI Analysis" />
            </div>
          </div>
        </DocSection>

        {/* Footer */}
        <section className="rounded-2xl border border-[#2A2F3A] bg-gradient-to-r from-[#181B22] to-[#20242D] p-8 text-center">
          <h2 className="text-2xl font-semibold">
            You're ready to monitor production AI.
          </h2>
          <p className="mt-3 text-[#8B93A7]">
            Generate an API key, integrate the SDK and start observing every LLM
            request in real time.
          </p>
        </section>
      </main>
    </div>
  );
}

/* ---------- Components ---------- */

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#2A2F3A] bg-[#111318] p-5">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA] font-bold text-[#111318]">
        {number}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[#8B93A7]">{text}</p>
    </div>
  );
}

function DocSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 mb-6 text-[#8B93A7]">{description}</p>
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-[#2A2F3A] bg-[#111318] p-5 text-sm leading-7 text-[#CBD5E1]">
      <code>{children}</code>
    </pre>
  );
}

function Feature({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-5">
      <p className="text-xs text-[#8B93A7]">{title}</p>
      <h3 className="mt-2 text-xl font-bold">{value}</h3>
      <p className="mt-2 text-sm text-[#8B93A7]">{desc}</p>
    </div>
  );
}

function Flow({ label }: { label: string }) {
  return (
    <div className="w-full rounded-lg border border-[#2A2F3A] bg-[#181B22] px-5 py-3 font-medium">
      {label}
    </div>
  );
}

function Arrow() {
  return <div className="text-[#A78BFA]">↓</div>;
}