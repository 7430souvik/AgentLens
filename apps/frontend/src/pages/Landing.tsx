import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#111318] text-slate-50">

            {/* ================= NAVBAR ================= */}

            <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#111318]/90 backdrop-blur">

                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10">

                    {/* Logo */}

                    <div
                        onClick={() => navigate("/")}
                        className="flex cursor-pointer items-center gap-2.5"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA] font-extrabold">
                            A
                        </div>

                        <span className="text-xl font-bold tracking-tight">
                            AgentLens
                        </span>
                    </div>


                    {/* Navigation */}

                    <div className="flex items-center gap-2 sm:gap-6">

                        <button className="hidden text-sm text-slate-400 transition hover:text-white sm:block">
                            Docs
                        </button>

                        <button className="hidden text-sm text-slate-400 transition hover:text-white sm:block">
                            GitHub
                        </button>

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                            className="text-sm text-slate-400 transition hover:text-white"
                        >
                            Login
                        </button>

                        <button
                            onClick={() =>
                                navigate("/signup")
                            }
                            className="rounded-lg bg-[#A78BFA] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                            Get Started
                        </button>

                    </div>

                </div>

            </nav>


            {/* ================= HERO ================= */}

            <section className="mx-auto max-w-6xl px-6 pb-20 pt-28 text-center lg:px-8">

                {/* Badge */}

                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-900 bg-[#181B22] px-4 py-2 text-xs text-blue-300">

                    <span className="h-2 w-2 rounded-full bg-green-500" />

                    AI observability for developers

                </div>


                {/* Heading */}

                <h1
                    className="mx-auto max-w-5xl text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
                    style={{ color: "#ffffff" }}
                >
                    Understand why your{" "}
                    <span className="text-[#A78BFA]">
                        AI application
                    </span>{" "}
                    fails.
                </h1>

                {/* Description */}

                <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">

                    Monitor LLM requests, errors,
                    latency and costs in one place.
                    Then use AI to understand what
                    went wrong and how to fix it.

                </p>


                {/* Buttons */}

                <div className="mt-9 flex flex-wrap justify-center gap-3">

                    <button
                        onClick={() =>
                            navigate("/signup")
                        }
                        className="rounded-lg bg-[#A78BFA] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                    >
                        Start Monitoring
                        <span className="ml-2">
                            →
                        </span>
                    </button>

                    <button className="rounded-lg border border-slate-700 px-6 py-3 text-sm text-slate-200 transition hover:bg-[#181B22]">
                        View Demo
                    </button>

                </div>


                <p className="mt-5 text-xs text-slate-600">
                    Built for AI agents, LLM
                    applications and developer
                    workflows.
                </p>

            </section>


            {/* ================= DASHBOARD PREVIEW ================= */}

            <section className="mx-auto max-w-6xl px-6 pb-28 lg:px-8">

                <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#181B22] shadow-2xl shadow-black/40">

                    {/* Browser Header */}

                    <div className="flex h-12 items-center gap-4 border-b border-slate-800 px-5">

                        <div className="flex gap-1.5">

                            <span className="h-2 w-2 rounded-full bg-slate-600" />
                            <span className="h-2 w-2 rounded-full bg-slate-600" />
                            <span className="h-2 w-2 rounded-full bg-slate-600" />

                        </div>

                        <div className="w-full max-w-md rounded-md border border-slate-800 bg-[#111318] px-5 py-1.5 text-xs text-slate-600">
                            app.agentlens.dev
                        </div>

                    </div>


                    {/* Dashboard */}

                    <div className="p-5 sm:p-7">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h3 className="text-xl font-bold">
                                    Production
                                </h3>

                                <p className="mt-1 text-xs text-slate-600">
                                    AI Application
                                </p>

                            </div>

                            <span className="text-xs text-green-500">
                                ● Operational
                            </span>

                        </div>


                        {/* Stats */}

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                            <StatCard
                                title="Events"
                                value="12,482"
                                change="+18.2%"
                            />

                            <StatCard
                                title="Errors"
                                value="184"
                                change="-12.4%"
                            />

                            <StatCard
                                title="Avg. Latency"
                                value="842ms"
                                change="-8.1%"
                            />

                            <StatCard
                                title="Total Cost"
                                value="$42.18"
                                change="+4.3%"
                            />

                        </div>


                        {/* Chart */}

                        <div className="mt-5 rounded-xl border border-slate-800 p-5">

                            <div className="mb-5 flex justify-between text-sm">

                                <span className="font-medium">
                                    Request volume
                                </span>

                                <span className="text-xs text-slate-600">
                                    Last 24 hours
                                </span>

                            </div>

                            <FakeChart />

                        </div>


                        {/* Events */}

                        <div className="mt-5 overflow-hidden rounded-xl border border-slate-800">

                            <div className="border-b border-slate-800 p-4 text-sm font-semibold">
                                Recent Events
                            </div>

                            <EventRow
                                name="llm.request"
                                model="gpt-5"
                                status="success"
                                duration="842ms"
                            />

                            <EventRow
                                name="llm.request"
                                model="gpt-5"
                                status="error"
                                duration="3.5s"
                            />

                            <EventRow
                                name="tool.call"
                                model="search"
                                status="success"
                                duration="124ms"
                            />

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= FEATURES ================= */}

            <section className="mx-auto max-w-6xl px-6 pb-28 lg:px-8">

                <div className="mb-12 text-center">

                    <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                        Built for AI
                    </div>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need
                        to debug AI
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
                        From raw telemetry to
                        AI-powered root cause
                        analysis.
                    </p>

                </div>


                <div className="grid gap-5 md:grid-cols-3">

                    <FeatureCard
                        icon="◈"
                        title="Observability"
                        description="Capture LLM requests, tools, errors, latency, tokens and costs in one place."
                    />

                    <FeatureCard
                        icon="⌕"
                        title="Error Analysis"
                        description="Inspect failed requests with complete event details, traces and error information."
                    />

                    <FeatureCard
                        icon="✦"
                        title="AI Root Cause"
                        description="Use AI to understand failures, identify likely causes and recommend fixes."
                    />

                </div>

            </section>


            {/* ================= CTA ================= */}

            <section className="mx-auto max-w-5xl px-6 pb-28">

                <div className="rounded-2xl border border-blue-900 bg-gradient-to-br from-slate-900 to-blue-950/40 px-6 py-16 text-center">

                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Start debugging
                        your AI application.
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
                        Create your first project,
                        generate an API key and
                        start sending telemetry.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/signup")
                        }
                        className="mt-7 rounded-lg bg-[#A78BFA] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                    >
                        Create Your Account →
                    </button>

                </div>

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="border-t border-slate-800 px-6 py-7 text-xs text-slate-600">

                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 sm:flex-row">

                    <span>
                        © 2026 AgentLens
                    </span>

                    <span>
                        AI observability for developers.
                    </span>

                </div>

            </footer>

        </div>
    );
}


/* ================= STAT CARD ================= */

function StatCard({
    title,
    value,
    change,
}: {
    title: string;
    value: string;
    change: string;
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-[#111318] p-5">

            <div className="text-xs text-slate-600">
                {title}
            </div>

            <div className="mt-2 text-2xl font-bold">
                {value}
            </div>

            <div
                className={`mt-1 text-xs ${
                    change.startsWith("+")
                        ? "text-green-500"
                        : "text-blue-400"
                }`}
            >
                {change}
            </div>

        </div>
    );
}


/* ================= EVENT ROW ================= */

function EventRow({
    name,
    model,
    status,
    duration,
}: {
    name: string;
    model: string;
    status: "success" | "error";
    duration: string;
}) {
    return (
        <div className="grid grid-cols-2 gap-3 border-b border-slate-800 px-4 py-4 text-xs sm:grid-cols-4">

            <span className="font-mono">
                {name}
            </span>

            <span className="text-slate-400">
                {model}
            </span>

            <span
                className={
                    status === "success"
                        ? "text-green-500"
                        : "text-red-400"
                }
            >
                ● {status}
            </span>

            <span className="text-slate-400">
                {duration}
            </span>

        </div>
    );
}


/* ================= FEATURE CARD ================= */

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-[#181B22] p-7 transition hover:-translate-y-1 hover:border-slate-700">

            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-950 text-xl text-blue-400">
                {icon}
            </div>

            <h3 className="text-lg font-semibold">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {description}
            </p>

        </div>
    );
}


/* ================= FAKE CHART ================= */

function FakeChart() {
    const heights = [
        35, 50, 42, 70, 58,
        82, 65, 95, 72, 88,
        76, 100, 83, 91, 68,
        78, 94, 86, 105, 98,
    ];

    return (
        <div className="flex h-36 items-end gap-1.5 border-b border-slate-800 px-2">

            {heights.map(
                (height, index) => (
                    <div
                        key={index}
                        className="flex-1 rounded-t bg-[#A78BFA]"
                        style={{
                            height: `${Math.min(
                                height,
                                100
                            )}%`,
                            opacity:
                                0.35 +
                                index / 50,
                        }}
                    />
                )
            )}

        </div>
    );
}