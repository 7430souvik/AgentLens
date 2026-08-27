import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";


export default function EventDetails() {
    const navigate = useNavigate();
    const { id, eventId } = useParams();

    const [event, setEvents] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [analysis, setAnalysis] = useState<any>(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    useEffect(()=>{
        const fetchEvent = async () =>{
            try{
                setLoading(true);
            setError("");

            console.log("PROJECT ID:", id);
            console.log("EVENT ID:", eventId);

            const response = await api.get(
                `/projects/${id}/events/${eventId}`
            );

            console.log(
                "EVENT RESPONSE:",
                response.data
            );

            setEvents(response.data.event);


            }catch(error){
                console.error(
                    "event details error",
                    error
                );

                setError(
                    "Failed to load error"
                );
            }finally{
                setLoading(false);
            }
        };

        if(eventId){
            fetchEvent();
        }
    }, [eventId]);


    const isError = event?.status ==="error";

    if (loading) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-[#111318] text-white">
                    Loading event...
                </div>
            );
    }

    if (error || !event) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-[#111318] text-white">
                    <div className="text-center">
                        <p className="text-[#FB7185]">
                            {error || "Event not found"}
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    `/projects/${id}/events`
                                )
                            }
                            className="mt-4 rounded-lg border border-[#2A2F3A] px-4 py-2 text-sm"
                        >
                            Back to Events
                        </button>
                    </div>
                </div>
            );
    }


    const handleAnalyze = async()=>{
        try{
            setAnalysisLoading(true);
            setError("");

            console.log("starting AI analysis");
            console.log("PROJECT ID:", id);
            console.log("EVENT ID:", eventId);

            const response = await api.post(
            `/projects/${id}/events/${eventId}/analyze`
            );

            console.log(
            "AI ANALYSIS RESPONSE:",
            response.data
            );

            setAnalysis(
            response.data.analysis
            );
        }catch(error){
             console.error(
            "AI ANALYSIS ERROR:",
            error
        );

        setError(
            "Failed to analyze event"
        );
        } finally {
            setAnalysisLoading(false);
        }


    };

    return (
        <div className="min-h-screen bg-[#111318] text-white">

            {/* ================= NAVBAR ================= */}

            <nav className="border-b border-[#2A2F3A] bg-[#111318]">

                <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">

                    <div
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="flex cursor-pointer items-center gap-2.5"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA] font-extrabold text-[#111318]">
                            A
                        </div>

                        <span className="text-xl font-bold">
                            AgentLens
                        </span>
                    </div>

                    <div className="flex items-center gap-5">

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="text-sm text-[#8B93A7] hover:text-white"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    `/projects/${id}`
                                )
                            }
                            className="text-sm text-[#8B93A7] hover:text-white"
                        >
                            Project
                        </button>

                        <button
                            onClick={() =>
                                navigate("/api-keys")
                            }
                            className="text-sm text-[#8B93A7] hover:text-white"
                        >
                            API Keys
                        </button>

                    </div>

                </div>

            </nav>


            {/* ================= MAIN ================= */}

            <main className="mx-auto max-w-[1200px] px-6 py-8 lg:px-8">

                {/* Breadcrumb */}

                <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#5F6675]">

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="hover:text-[#A78BFA]"
                    >
                        Projects
                    </button>

                    <span>/</span>

                    <button
                        onClick={() =>
                            navigate(
                                `/projects/${id}`
                            )
                        }
                        className="hover:text-[#A78BFA]"
                    >
                        AI Support Agent
                    </button>

                    <span>/</span>

                    <button
                        onClick={() =>
                            navigate(
                                `/projects/${id}/events`
                            )
                        }
                        className="hover:text-[#A78BFA]"
                    >
                        Events
                    </button>

                    <span>/</span>

                    <span className="text-[#CBD5E1]">
                        {eventId}
                    </span>

                </div>


                {/* ================= HEADER ================= */}

                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                        <div className="flex items-center gap-3">

                            <h1 className="font-mono text-2xl font-bold">
                                {event.type}
                            </h1>

                            <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                    event.status === "error"
                                        ? "bg-[#FB7185]/10 text-[#FB7185]"
                                        : "bg-[#34D399]/10 text-[#34D399]"
                                }`}
                            >
                                ●{" "}
                                {event.status
                                    ? event.status.charAt(0).toUpperCase() +
                                    event.status.slice(1)
                                    : "Unknown"}
                            </span>

                        </div>

                        <p className="mt-2 text-xs text-[#5F6675]">
                            {eventId} ·{" "}
                            {new Date(event.createdAt).toLocaleString()}
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate(`/projects/${id}/events`)
                        }
                        className="rounded-lg border border-[#2A2F3A] px-4 py-2.5 text-sm text-[#CBD5E1] hover:bg-[#181B22]"
                    >
                        ← Back to Events
                    </button>

                </div>

                {/* ================= ERROR BANNER ================= */}

                {isError && (
                    <div className="mb-6 rounded-xl border border-[#FB7185]/20 bg-[#FB7185]/5 p-5">

                        <div className="flex gap-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FB7185]/10 text-[#FB7185]">
                                !
                            </div>

                            <div>

                                <h2 className="font-semibold text-[#FB7185]">
                                    Request failed
                                </h2>

                                <p className="mt-1 text-sm text-[#CBD5E1]">
                                    The LLM request did not
                                    complete successfully.
                                </p>

                            </div>

                        </div>

                    </div>
                )}


                {/* ================= TOP STATS ================= */}

                <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

                   <DetailStat
                        label="Model"
                        value={event.model || "Unknown"}
                    />

                    <DetailStat
                        label="Duration"
                        value={
                            event.duration != null
                                ? `${event.duration}ms`
                                : "—"
                        }
                    />

                    <DetailStat
                        label="Input Tokens"
                        value={
                            event.inputTokens != null
                                ? event.inputTokens.toLocaleString()
                                : "—"
                        }
                    />

                    <DetailStat
                        label="Output Tokens"
                        value={
                            event.outputTokens != null
                                ? event.outputTokens.toLocaleString()
                                : "—"
                        }
                    />

                </div>


                {/* ================= CONTENT ================= */}

                <div className="grid gap-6 lg:grid-cols-[1fr_350px]">


                    {/* ================= LEFT ================= */}

                    <div className="space-y-6">


                        {/* Request Metadata */}

                        <section className="rounded-xl border border-[#2A2F3A] bg-[#181B22]">

                            <SectionHeader
                                title="Request metadata"
                                description="Information captured from the LLM request."
                            />

                            <div className="grid gap-5 p-6 sm:grid-cols-2">

                                <MetadataItem
                                    label="Event ID"
                                    value={
                                        eventId ||
                                        "evt_001"
                                    }
                                    mono
                                />

                                <MetadataItem
                                    label="Event Type"
                                    value={event.type}
                                    mono
                                />

                                <MetadataItem
                                    label="Model"
                                    value={event.model || "Unknown"}
                                />

                                <MetadataItem
                                    label="Provider"
                                    value={event.provider || "Unknown"}
                                />

                                <MetadataItem
                                    label="Status"
                                    value={event.status || "unknown"}
                                    error={event.status === "error"}
                                />

                                <MetadataItem
                                    label="Created At"
                                    value={
                                        event.createdAt
                                            ? new Date(
                                                event.createdAt
                                            ).toLocaleString()
                                            : "—"
                                    }
                                                                    />

                            </div>

                        </section>


                        {/* Error */}

                        <section className="rounded-xl border border-[#2A2F3A] bg-[#181B22]">

                            <SectionHeader
                                title="Error"
                                description="Failure information captured from the request."
                            />

                            <div className="p-6">

                                <div className="rounded-lg border border-[#FB7185]/20 bg-[#111318] p-5">

                                    <p className="text-sm font-medium text-[#FB7185]">
                                        {event.errorMessage || "Unknown error"}
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">
                                        {event.errorMessage
                                            ? "The request failed while processing the LLM operation."
                                            : "No detailed error information was captured."}
                                    </p>

                                </div>


                                <div className="mt-4">

                                    <p className="mb-2 text-xs font-medium text-[#8B93A7]">
                                        Error message
                                    </p>

                                    <pre className="overflow-x-auto rounded-lg border border-[#2A2F3A] bg-[#111318] p-4 text-xs leading-6 text-[#FB7185]">
                                        {event.errorMessage ||
                                            "No error message available"}
                                    </pre>

                                </div>


                                <div className="mt-4">

                                    <p className="mb-2 text-xs font-medium text-[#8B93A7]">
                                        Error stack
                                    </p>

                                    <pre className="max-h-56 overflow-auto rounded-lg border border-[#2A2F3A] bg-[#111318] p-4 text-xs leading-6 text-[#8B93A7]">
                                        {event.errorStack ||
                                            "No error stack available"}
                                    </pre>

                                </div>

                            </div>

                        </section>


                        {/* Input */}

                       <section className="rounded-xl border border-[#2A2F3A] bg-[#181B22]">

                            <SectionHeader
                                title="Input"
                                description="Payload sent to the LLM."
                            />

                            <div className="p-6">

                                <pre className="overflow-x-auto rounded-lg border border-[#2A2F3A] bg-[#111318] p-5 text-xs leading-6 text-[#CBD5E1]">
                                    {JSON.stringify(
                                        event.payload ?? {},
                                        null,
                                        2
                                    )}
                                </pre>

                            </div>

                        </section>

                        {/* Output */}

                        <section className="rounded-xl border border-[#2A2F3A] bg-[#181B22]">

                            <SectionHeader
                                title="Output"
                                description="Response returned by the LLM."
                            />

                            <div className="p-6">

                                <div className="rounded-lg border border-[#2A2F3A] bg-[#111318] p-5">

                                    {event.output ? (
                                        <pre className="whitespace-pre-wrap overflow-x-auto text-sm leading-6 text-[#CBD5E1]">
                                            {typeof event.output === "string"
                                                ? event.output
                                                : JSON.stringify(
                                                    event.output,
                                                    null,
                                                    2
                                                )}
                                        </pre>
                                    ) : (
                                        <p className="text-sm text-[#5F6675]">
                                            No output was returned.
                                        </p>
                                    )}

                                </div>

                            </div>

                        </section>

                    </div>


                    {/* ================= RIGHT ================= */}

                    <aside className="space-y-6">


                        {/* AI Analysis */}

                        <section className="rounded-xl border border-[#A78BFA]/20 bg-[#181B22] p-6">

                            <div className="mb-5 flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#242036] text-[#A78BFA]">
                                    ✦
                                </div>

                                <div>

                                    <h2 className="font-semibold">
                                        AI Analysis
                                    </h2>

                                    <p className="text-xs text-[#8B93A7]">
                                        Powered by AgentLens
                                    </p>

                                </div>

                            </div>


                             {analysisLoading ? (
                        <p className="text-sm text-[#8B93A7]">
                            Analyzing event...
                        </p>
                    ) : analysis ? (

                        <>
                            <div className="mb-5 rounded-lg border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-4">

                                <div className="flex items-center gap-2">

                                    <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />

                                    <span className="text-xs font-medium text-[#FBBF24]">
                                        {analysis.severity}
                                    </span>

                                </div>

                            </div>



                            <AnalysisBlock
                                        title="Summary"
                                        text={analysis.summary}
                                    />

                                    <AnalysisBlock
                                        title="Root Cause"
                                        text={analysis.rootCause}
                                    />

                                    <AnalysisBlock
                                        title="Impact"
                                        text={analysis.impact}
                                    />

                                    <AnalysisBlock
                                        title="Recommendation"
                                        text={analysis.recommendation}
                                    />

                                </>

                            ) : (

                                <p className="text-sm text-[#8B93A7]">
                                    No AI analysis available for this event.
                                </p>

                            )}

                        </section>


                        {/* Analyze Button */}

                        <section className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-6">

                            <h3 className="font-semibold">
                                Analyze this event
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-[#8B93A7]">
                                Let AgentLens analyze this
                                event and identify the
                                likely root cause.
                            </p>

                            <button
                            onClick={handleAnalyze}
                            disabled={analysisLoading}
                                className="mt-5 w-full rounded-lg bg-[#A78BFA] px-4 py-3 text-sm font-semibold text-[#111318] transition hover:bg-[#8B5CF6] hover:text-white"
                            >
                                {analysisLoading
                                    ? "Analyzing..."
                                    : "✦ Analyze with AI"}
                            </button>

                        </section>


                        {/* Event Timing */}

                        <section className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-6">

                            <h3 className="font-semibold">
                                Timing
                            </h3>

                            <div className="mt-5 space-y-4">

                                <TimingRow
                                    label="Request started"
                                    value="09:42:18.102"
                                />

                                <TimingRow
                                    label="Provider request"
                                    value="09:42:18.421"
                                />

                                <TimingRow
                                    label="Timeout"
                                    value="09:42:48.421"
                                />

                                <TimingRow
                                    label="Total duration"
                                    value="30.32s"
                                    highlight
                                />

                            </div>

                        </section>

                    </aside>

                </div>

            </main>

        </div>
    );

}


/* ================= DETAIL STAT ================= */

function DetailStat({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-5">

            <p className="text-xs text-[#8B93A7]">
                {label}
            </p>

            <p className="mt-2 truncate text-lg font-semibold">
                {value}
            </p>

        </div>
    );
}


/* ================= SECTION HEADER ================= */

function SectionHeader({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="border-b border-[#2A2F3A] p-5">

            <h2 className="font-semibold">
                {title}
            </h2>

            <p className="mt-1 text-xs text-[#8B93A7]">
                {description}
            </p>

        </div>
    );
}


/* ================= METADATA ================= */

function MetadataItem({
    label,
    value,
    mono = false,
    error = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
    error?: boolean;
}) {
    return (
        <div>

            <p className="mb-1.5 text-xs text-[#5F6675]">
                {label}
            </p>

            <p
                className={`truncate text-sm ${
                    mono
                        ? "font-mono"
                        : ""
                } ${
                    error
                        ? "text-[#FB7185]"
                        : "text-[#CBD5E1]"
                }`}
            >
                {value}
            </p>

        </div>
    );
}


/* ================= ANALYSIS ================= */

function AnalysisBlock({
    title,
    text,
}: {
    title: string;
    text: string;
}) {
    return (
        <div className="mb-5 last:mb-0">

            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#A78BFA]">
                {title}
            </h3>

            <p className="text-sm leading-6 text-[#CBD5E1]">
                {text}
            </p>

        </div>
    );
}


/* ================= TIMING ================= */

function TimingRow({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4">

            <span className="text-xs text-[#8B93A7]">
                {label}
            </span>

            <span
                className={
                    highlight
                        ? "font-mono text-xs text-[#A78BFA]"
                        : "font-mono text-xs text-[#CBD5E1]"
                }
            >
                {value}
            </span>

        </div>
    );
}