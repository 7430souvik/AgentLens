import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";
import RequestChart from "../components/RequestChart";
import EventBreakdown from "../components/EventBreakdown";
import ErrorRow from "../components/ErrorRow";
import ModelRow from "../components/ModelRow";

export default function Project() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [overview, setOverview] = useState<any>(null);

    useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `/projects/${id}`
            );

            console.log(
                "PROJECT:",
                response.data
            );

            setProject(
                response.data.project ||
                response.data
            );

        } catch (error: any) {
            console.error(
                "PROJECT ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load project"
            );
                } finally {
                    setLoading(false);
                }
            };

            fetchProject();
        }, [id]);
        useEffect(() => {
    if (!id) return;

    const fetchOverview = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `/projects/${id}/overview`
            );

            console.log(
                "PROJECT OVERVIEW:",
                response.data
            );

            setOverview(response.data);

        } catch (error: any) {
            console.error(
                "PROJECT OVERVIEW ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load project overview"
            );
        } finally {
            setLoading(false);
        }
    };

    fetchOverview();
        }, [id]);

    return (
        <div className="min-h-screen bg-[#111318] text-white">

            {/* ================= NAVBAR ================= */}

            <nav className="border-b border-[#2A2F3A] bg-[#111318]">

                <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">

                    {/* Logo */}

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


                    {/* Right */}

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() =>
                                navigate(`/projects/${id}/keys`)
                            }
                            className="px-3 py-2 text-sm text-[#8B93A7] transition hover:text-white"
                        >
                            API Keys
                        </button>

                        <div className="h-7 w-px bg-[#2A2F3A]" />

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="text-sm text-[#8B93A7] transition hover:text-white"
                        >
                            Dashboard
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
                        className="transition hover:text-[#A78BFA]"
                    >
                        Projects
                    </button>

                    <span>/</span>

                    <span className="text-[#CBD5E1]">
                        {project?.name ?? "Loading..."}
                    </span>

                </div>


                {/* ================= PROJECT HEADER ================= */}

                <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#242036] text-xl text-[#A78BFA]">
                            ◈
                        </div>

                        <div>

                            <div className="flex items-center gap-3">

                                <h1 className="text-2xl font-bold">
                                    {project?.name ?? "Loading..."}
                                </h1>

                                <span className="rounded-full bg-[#34D399]/10 px-2.5 py-1 text-[11px] font-medium text-[#34D399]">
                                    ● Healthy
                                </span>

                            </div>

                            <p className="mt-1 text-sm text-[#8B93A7]">
                                Customer support LLM
                                application
                            </p>

                        </div>

                    </div>


                    {/* Actions */}

                    <div className="flex gap-3">

                        <button
                            onClick={() =>
                                navigate(
                                    `/projects/${id}/events`
                                )
                            }
                            className="rounded-lg border border-[#2A2F3A] px-4 py-2.5 text-sm font-medium text-[#CBD5E1] transition hover:bg-[#181B22]"
                        >
                            View Events
                        </button>

                        <button
                            onClick={() =>
                                navigate(`/projects/${id}/keys`)
                            }
                            className="px-3 py-2 text-sm text-[#8B93A7] transition hover:text-white"
                        >
                            API Keys
                        </button>

                    </div>

                </div>


                {/* ================= TIME FILTER ================= */}

                <div className="mb-6 flex items-center justify-between">

                    <div className="flex rounded-lg border border-[#2A2F3A] bg-[#181B22] p-1">

                        <TimeButton
                            text="24h"
                            active
                        />

                        <TimeButton text="7d" />

                        <TimeButton text="30d" />

                    </div>

                    <span className="text-xs text-[#5F6675]">
                        Updated just now
                    </span>

                </div>


                {/* ================= STATS ================= */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <ProjectStat
                        title="Total Events"
                        value={(
                            overview?.stats?.totalEvents ?? 0
                        ).toLocaleString()}
                        change=""
                    />

                    <ProjectStat
                        title="Error Rate"
                        value={`${(
                            overview?.stats?.errorRate ?? 0
                        ).toFixed(2)}%`}
                        change=""
                    />

                    <ProjectStat
                        title="Avg. Latency"
                        value={`${(
                            overview?.stats?.averageLatency ?? 0
                        ).toLocaleString()}ms`}
                        change=""
                        positive
                    />

                    <ProjectStat
                        title="Estimated Cost"
                        value={`$${(
                            overview?.stats?.estimatedCost ?? 0
                        ).toFixed(2)}`}
                        change=""
                    />

                </div>

                {/* ================= MAIN GRID ================= */}

                <div className="grid gap-6 xl:grid-cols-[1fr_360px]">


                    {/* ================= LEFT ================= */}

                    <div className="space-y-6">


                        {/* Request Volume */}

                        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-6">

                            <div className="mb-6 flex items-center justify-between">

                                <div>

                                    <h2 className="font-semibold">
                                        Request volume
                                    </h2>

                                    <p className="mt-1 text-xs text-[#8B93A7]">
                                        Events received over
                                        the selected period
                                    </p>

                                </div>

                                <span className="text-xs text-[#5F6675]">
                                    Last 24 hours
                                </span>

                            </div>

                            <RequestChart
                                data={overview?.requestVolume ?? []} 
                            />

                        </div>


                        {/* Event Breakdown */}

                        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22]">

                            <div className="flex items-center justify-between border-b border-[#2A2F3A] p-5">

                                <div>

                                    <h2 className="font-semibold">
                                        Event breakdown
                                    </h2>

                                    <p className="mt-1 text-xs text-[#8B93A7]">
                                        Events grouped by type
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/projects/${id}/events`
                                        )
                                    }
                                    className="text-xs text-[#A78BFA] hover:text-[#8B5CF6]"
                                >
                                    View all →
                                </button>

                            </div>


                            {overview?.eventBreakdown?.length > 0 ? (

                                overview.eventBreakdown.map(
                                    (event: any) => (
                                        <EventBreakdown
                                            key={event.type}
                                            type={event.type}
                                            count={event.count.toLocaleString()}
                                            percentage={`${event.percentage}%`}
                                            
                                        />
                                    )
                                )

                            ) : (

                                <div className="p-8 text-center">

                                    <p className="text-sm text-[#8B93A7]">
                                        No events yet
                                    </p>

                                    <p className="mt-1 text-xs text-[#5F6675]">
                                        Event breakdown will appear
                                        once your application sends events.
                                    </p>

                                </div>

                            )}

                        </div>


                        {/* Recent Errors */}

                        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22]">

                            <div className="flex items-center justify-between border-b border-[#2A2F3A] p-5">

                                <div>

                                    <h2 className="font-semibold">
                                        Recent errors
                                    </h2>

                                    <p className="mt-1 text-xs text-[#8B93A7]">
                                        Latest failed events
                                    </p>


                                </div>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/projects/${id}/events?status=error`
                                        )
                                    }
                                    className="text-xs text-[#A78BFA]"
                                >
                                    View all →
                                </button>

                            </div>


                            {overview?.recentErrors?.length > 0 ? (

                                overview.recentErrors.map(
                                    (error: any) => (
                                        <ErrorRow
                                            key={error.id}
                                            message={
                                                error.message ||
                                                "Unknown error"
                                            }
                                            time={new Date(
                                                error.createdAt
                                            ).toLocaleString()}
                                            model={
                                                error.model ||
                                                "Unknown"
                                            }
                                        />
                                    )
                                )

                            ) : (

                                <div className="p-8 text-center">

                                    <p className="text-sm text-[#34D399]">
                                        No recent errors
                                    </p>

                                    <p className="mt-1 text-xs text-[#5F6675]">
                                        Your application hasn't reported
                                        any failed events yet.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* ================= RIGHT ================= */}

                    <aside className="space-y-6">


                        {/* AI Analysis */}

                        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-6">

                            <div className="mb-5 flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#242036] text-[#A78BFA]">
                                    ✦
                                </div>

                                <div>

                                    <h2 className="font-semibold">
                                        AI Insights
                                    </h2>

                                    <p className="text-xs text-[#8B93A7]">
                                        Automated analysis
                                    </p>

                                </div>

                            </div>


                            <div className="rounded-lg border border-[#2A2F3A] bg-[#111318] p-4">

                                <div className="mb-3 flex items-center gap-2">

                                    <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />

                                    <span className="text-xs font-medium text-[#FBBF24]">
                                        Attention needed
                                    </span>

                                </div>

                                <p className="text-sm leading-6 text-[#CBD5E1]">
                                    Recent LLM requests
                                    show increased
                                    latency and several
                                    timeout errors.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/projects/${id}/events?status=error`
                                        )
                                    }
                                    className="mt-4 text-xs font-medium text-[#A78BFA]"
                                >
                                    Investigate errors →
                                </button>

                            </div>

                        </div>


                        {/* Models */}

                        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-6">

                            <h2 className="font-semibold">
                                Models
                            </h2>

                            <p className="mt-1 text-xs text-[#8B93A7]">
                                Usage by model
                            </p>


                              {overview?.models?.length > 0 ? (

                                overview.models.map(
                                    (model: any) => (
                                        <ModelRow
                                            key={model.name}
                                            model={model.name}
                                            requests={model.requests.toLocaleString()}
                                            percentage={`${model.percentage}%`}
                                        />
                                    )
                                )

                            ) : (

                                <div className="py-8 text-center">

                                    <p className="text-sm text-[#8B93A7]">
                                        No model usage yet
                                    </p>

                                    <p className="mt-1 text-xs text-[#5F6675]">
                                        Model usage will appear once
                                        your application sends events.
                                    </p>

                                </div>

                            )}
                        </div>


                        {/* Project Information */}

                        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-6">

                            <h2 className="font-semibold">
                                Project information
                            </h2>

                            <div className="mt-5 space-y-4">

                                <InfoRow
                                    label="Project ID"
                                    value={
                                        id ||
                                        "project-id"
                                    }
                                />

                                <InfoRow
                                    label="Environment"
                                    value="Production"
                                />

                                <InfoRow
                                    label="Created"
                                    value="Aug 24, 2026"
                                />

                                <InfoRow
                                    label="Events"
                                    value="12,482"
                                />

                            </div>

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
}


/* ================= TIME BUTTON ================= */

function TimeButton({
    text,
    active = false,
}: {
    text: string;
    active?: boolean;
}) {
    return (
        <button
            className={
                active
                    ? "rounded-md bg-[#A78BFA] px-3 py-1.5 text-xs font-semibold text-[#111318]"
                    : "rounded-md px-3 py-1.5 text-xs text-[#8B93A7] hover:text-white"
            }
        >
            {text}
        </button>
    );
}


/* ================= PROJECT STAT ================= */

function ProjectStat({
    title,
    value,
    change,
    positive = false,
}: {
    title: string;
    value: string;
    change: string;
    positive?: boolean;
}) {
    return (
        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-5">

            <p className="text-xs text-[#8B93A7]">
                {title}
            </p>

            <div className="mt-2 flex items-end justify-between">

                <span className="text-2xl font-bold">
                    {value}
                </span>

                <span
                    className={
                        positive
                            ? "text-xs text-[#34D399]"
                            : "text-xs text-[#FB7185]"
                    }
                >
                    {change}
                </span>

            </div>

        </div>
    );
}



/* ================= INFO ROW ================= */

function InfoRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4">

            <span className="text-xs text-[#5F6675]">
                {label}
            </span>

            <span className="max-w-[190px] truncate text-right text-xs text-[#CBD5E1]">
                {value}
            </span>

        </div>
    );
}