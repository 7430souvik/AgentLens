import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/axios";

type EventStatus = "success" | "error";

type EventItem = {
    id: string;
    type: string;
    model: string;
    status: EventStatus;
    duration: string;
    inputTokens: number;
    outputTokens: number;
    createdAt: string;
};



export default function Events() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [searchParams] = useSearchParams();

    const [events, setEvents] =useState<EventItem[]>([]);

    const [loading, setLoading] =useState(true);

    const [error, setError] =useState("");
    
    const [stats, setStats] = useState({total:0, successful:0, errors:0});

    const [pagination, setPagination] = useState({page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    useEffect(() => {

        if (!id) return;

        const fetchEvents = async () => {

            try {

                setLoading(true);
                setError("");

                const status =
                    searchParams.get("status");

                const response =
                    await api.get(
                        `/projects/${id}/events`,
                        {
                            params: {
                                page: 1,
                                limit: 50,
                                ...(status
                                    ? { status }
                                    : {}),
                            },
                        }
                    );

                console.log(
                    "EVENTS:",
                    response.data
                );

                setEvents(
                    response.data.events ?? []
                );

            } catch (error: any) {

                console.error(
                    "EVENT API ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load events"
                );

            } finally {

                setLoading(false);

            }
        };

        const fetchStats = async() =>{
            try{
                const response = await api.get(
                    `/projects/${id}/stats`
                );

                console.log("PROJECT STATS RESPONSE:", response.data);

                console.log(
                    "PROJECT STATS:",
                    response.data
                );

                setStats({
                    total: response.data.stats.totalEvents ?? 0,
                    successful: response.data.stats.successCount ?? 0,
                    errors: response.data.stats.errors ?? 0,
                });

            }catch(error){
                console.error("Stats api error:", error);

            }
        }

        fetchEvents();
        fetchStats();

    }, [id, searchParams]);

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

            <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">

                {/* Breadcrumb */}

                <div className="mb-6 flex items-center gap-2 text-xs text-[#5F6675]">

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

                    <span className="text-[#CBD5E1]">
                        Events
                    </span>

                </div>


                {/* ================= HEADER ================= */}

                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                    <div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Events
                        </h1>

                        <p className="mt-2 text-sm text-[#8B93A7]">
                            Inspect every request,
                            tool call and error from
                            your application.
                        </p>

                    </div>

                    <div className="text-xs text-[#5F6675]">
                        {stats.total.toLocaleString()} total events
                    </div>

                </div>


                {/* ================= STATS ================= */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <EventStat
                        label="Total Events"
                        value={stats.total.toLocaleString()}
                    />

                    <EventStat
                        label="Successful"
                        value={stats.successful.toLocaleString()}
                        success
                    />

                    <EventStat
                        label="Errors"
                        value={stats.errors.toLocaleString()}
                        error
                    />

                </div>


                {/* ================= FILTER BAR ================= */}

                <div className="mb-5 rounded-xl border border-[#2A2F3A] bg-[#181B22] p-4">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        {/* Search */}

                        <div className="relative flex-1 lg:max-w-md">

                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6675]">
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search events..."
                                className="w-full rounded-lg border border-[#2A2F3A] bg-[#111318] py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-[#5F6675] focus:border-[#A78BFA]"
                            />

                        </div>


                        {/* Filters */}

                        <div className="flex flex-wrap gap-2">

                            <FilterButton
                                label="All"
                                active
                            />

                            <FilterButton
                                label="Success"
                            />

                            <FilterButton
                                label="Error"
                                error
                            />

                            <FilterButton
                                label="LLM Request"
                            />

                            <FilterButton
                                label="Tool Call"
                            />

                        </div>

                    </div>

                </div>


                {/* ================= EVENTS TABLE ================= */}

                <div className="overflow-hidden rounded-xl border border-[#2A2F3A] bg-[#181B22]">

                    {/* Table header */}

                    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1.2fr] border-b border-[#2A2F3A] px-5 py-4 text-[11px] font-medium uppercase tracking-wide text-[#5F6675] lg:grid">

                        <span>Event</span>
                        <span>Model</span>
                        <span>Status</span>
                        <span>Duration</span>
                        <span>Tokens</span>
                        <span>Time</span>

                    </div>


                    {/* Rows */}

                    {events.map((event) => (
                        <EventTableRow
                            key={event.id}
                            event={event}
                            onClick={() =>
                                navigate(
                                    `/projects/${id}/events/${event.id}`
                                )
                            }
                        />
                    ))}

                </div>


                {/* ================= PAGINATION ================= */}

                <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <p className="text-xs text-[#5F6675]">
                        Showing 1–8 of 12,482 events
                    </p>

                    <div className="flex items-center gap-2">

                        <button
                            disabled
                            className="rounded-lg border border-[#2A2F3A] px-3 py-2 text-xs text-[#5F6675]"
                        >
                            ← Previous
                        </button>

                        <button className="rounded-lg bg-[#A78BFA] px-3 py-2 text-xs font-semibold text-[#111318]">
                            1
                        </button>

                        <button className="rounded-lg border border-[#2A2F3A] px-3 py-2 text-xs text-[#CBD5E1] hover:bg-[#181B22]">
                            2
                        </button>

                        <button className="rounded-lg border border-[#2A2F3A] px-3 py-2 text-xs text-[#CBD5E1] hover:bg-[#181B22]">
                            3
                        </button>

                        <button className="rounded-lg border border-[#2A2F3A] px-3 py-2 text-xs text-[#CBD5E1] hover:bg-[#181B22]">
                            Next →
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}


/* ================= EVENT STAT ================= */

function EventStat({
    label,
    value,
    success = false,
    error = false,
}: {
    label: string;
    value: string;
    success?: boolean;
    error?: boolean;
}) {
    return (
        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-5">

            <p className="text-xs text-[#8B93A7]">
                {label}
            </p>

            <p
                className={`mt-2 text-2xl font-bold ${
                    success
                        ? "text-[#34D399]"
                        : error
                          ? "text-[#FB7185]"
                          : "text-white"
                }`}
            >
                {value}
            </p>

        </div>
    );
}


/* ================= FILTER BUTTON ================= */

function FilterButton({
    label,
    active = false,
    error = false,
}: {
    label: string;
    active?: boolean;
    error?: boolean;
}) {
    return (
        <button
            className={
                active
                    ? "rounded-lg bg-[#A78BFA] px-3 py-2 text-xs font-semibold text-[#111318]"
                    : error
                      ? "rounded-lg border border-[#FB7185]/30 px-3 py-2 text-xs text-[#FB7185] hover:bg-[#FB7185]/5"
                      : "rounded-lg border border-[#2A2F3A] px-3 py-2 text-xs text-[#8B93A7] hover:bg-[#20242D] hover:text-white"
            }
        >
            {label}
        </button>
    );
}


/* ================= EVENT ROW ================= */

function EventTableRow({
    event,
    onClick,
}: {
    event: EventItem;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group w-full border-b border-[#2A2F3A] px-5 py-4 text-left transition last:border-0 hover:bg-[#20242D]"
        >

            {/* Desktop */}

            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1.2fr] items-center lg:grid">

                <div>

                    <p className="font-mono text-sm text-[#CBD5E1] group-hover:text-[#A78BFA]">
                        {event.type}
                    </p>

                    <p className="mt-1 text-[11px] text-[#5F6675]">
                        {event.id}
                    </p>

                </div>

                <span className="text-xs text-[#CBD5E1]">
                    {event.model}
                </span>

                <span
                    className={
                        event.status ===
                        "success"
                            ? "text-xs text-[#34D399]"
                            : "text-xs text-[#FB7185]"
                    }
                >
                    ● {event.status}
                </span>

                <span className="text-xs text-[#CBD5E1]">
                    {event.duration}
                </span>

                <span className="text-xs text-[#8B93A7]">
                    {event.inputTokens +
                        event.outputTokens}
                </span>

                <span className="text-xs text-[#8B93A7]">
                    {event.createdAt}
                </span>

            </div>


            {/* Mobile */}

            <div className="lg:hidden">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <p className="font-mono text-sm text-[#CBD5E1]">
                            {event.type}
                        </p>

                        <p className="mt-1 text-[11px] text-[#5F6675]">
                            {event.id}
                        </p>

                    </div>

                    <span
                        className={
                            event.status ===
                            "success"
                                ? "text-xs text-[#34D399]"
                                : "text-xs text-[#FB7185]"
                        }
                    >
                        ● {event.status}
                    </span>

                </div>


                <div className="mt-4 grid grid-cols-3 gap-3">

                    <MobileStat
                        label="Model"
                        value={event.model}
                    />

                    <MobileStat
                        label="Duration"
                        value={event.duration}
                    />

                    <MobileStat
                        label="Time"
                        value={event.createdAt}
                    />

                </div>

            </div>

        </button>
    );
}


/* ================= MOBILE STAT ================= */

function MobileStat({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>

            <p className="text-[10px] uppercase text-[#5F6675]">
                {label}
            </p>

            <p className="mt-1 truncate text-xs text-[#CBD5E1]">
                {value}
            </p>

        </div>
    );
}