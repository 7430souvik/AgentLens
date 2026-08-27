import { useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import Navbar from "./Navbar";


type Project = {
    id: string;
    name: string;
    slug: string;
    description: string | null;

    events?: number;
    errors?: number;
    latency?: string;
};


export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({
    totalEvents: 0,
    errors: 0,
    averageLatency: 0,
    estimatedCost: 0,
    });
    const [project, setProject] = useState<any>(null);
    const [apiKey, setApiKey] = useState<any>(null);

    const [totalEvents, setTotalEvents] = useState(0);
    const [totalErrors, setTotalErrors] = useState(0);

    const navigate = useNavigate();
    
    

    useEffect(() => {
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/projects");

            console.log(
                "PROJECT RESPONSE:",
                response.data
            );

            const userProjects =
                response.data.projects ?? [];

            // Fetch stats for every project
            const projectsWithStats =
                await Promise.all(
                    userProjects.map(
                        async (project: Project) => {
                            try {
                                const statsResponse =
                                    await api.get(
                                        `/projects/${project.id}/stats`
                                    );

                                const stats =
                                    statsResponse.data.stats;

                                return {
                                    ...project,

                                    events:
                                        stats.totalEvents ?? 0,

                                    errors:
                                        stats.errors ?? 0,

                                    latency:
                                        `${Math.round(
                                            stats.averageLatency ?? 0
                                        )}ms`,
                                };

                            } catch (error) {
                                console.error(
                                    `STATS ERROR FOR PROJECT ${project.id}:`,
                                    error
                                );

                                return {
                                    ...project,
                                    events: 0,
                                    errors: 0,
                                    latency: "0ms",
                                };
                            }
                        }
                    )
                );

            console.log(
                "PROJECTS WITH STATS:",
                projectsWithStats
            );

            setProjects(projectsWithStats);

            if (projectsWithStats.length > 0) {
                setProject(projectsWithStats[0]);
            } else {
                setProject(null);
            }

        } catch (error: any) {
            console.error(
                "PROJECT API ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load projects"
            );

        } finally {
            setLoading(false);
        }
    };

    fetchProjects();
}, []);

    

    useEffect(()=>{
        if(!project?.id) return;

        const fetchStats = async()=>{
            try{
                const response = await api.get(
                    `projects/${project.id}/stats`
                );
                console.log(
                    "project stats:",
                    response.data

                );

                const data = response.data.stats;

                setStats({
                    totalEvents:
                        data.totalEvents ?? 0,

                    errors:
                        data.errors ?? 0,

                    averageLatency:
                        data.averageLatency ?? 0,

                    estimatedCost:
                        data.estimatedCost ?? 0,
                });

                setTotalEvents(
                    data.totalEvents ?? 0
                );

                setTotalErrors(
                    data.errors ?? 0
                );

                }catch(error){
                    console.error("stats api error", error);

            }
            
        };
        fetchStats();
    },[project?.id])



    // useEffect(() => {
    // if (!project?.id) return;

//     const fetchApiKey = async () => {
//         try {
//             const response = await api.get(
//                 `/projects/${project.id}/keys`
//             );

//             const keys =
//                 response.data.keys ??
//                 response.data ??
//                 [];

//             if (keys.length > 0) {
//                 setApiKey(keys[0]);
//             } else {
//                 setApiKey(null);
//             }

//         } catch (error: any) {
//             console.error(
//                 "API KEY API ERROR:",
//                 error
//             );
//         }
//     };

//     fetchApiKey();

// }, [project?.id]);

    function getProjectStatus(
            totalEvents: number,
            errors: number
        ) {
            if (totalEvents === 0) {
                return "healthy";
            }

            const errorRate =
                (errors / totalEvents) * 100;

            if (errorRate >= 2) {
                return "warning";
            }

            return "healthy";
        }
        const setupSteps = [
        {
            number: "1",
            title: "Create a project",
            completed: projects.length > 0,
        },
        {
            number: "2",
            title: "Generate an API key",
            completed: !!apiKey,
        },
        {
            number: "3",
            title: "Send your first event",
            completed: totalEvents > 0,
        },
        {
            number: "4",
            title: "Analyze an error",
            completed: totalErrors > 0,
        },
    ];

    const completedSteps = setupSteps.filter(
        (step) => step.completed
    ).length;

    const progress =
        (completedSteps / setupSteps.length) * 100;

    return (
        <div className="min-h-screen bg-[#111318] text-white">


            {/* ================= NAVBAR ================= */}
            <Navbar
                projectId={project?.id}
            />

            
    
            {/* ================= MAIN ================= */}

            <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">

                {/* Header */}

                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                        <p className="mb-2 text-sm text-[#8B93A7]">
                            Overview
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-[#8B93A7]">
                            Monitor your AI applications
                            from one place.
                        </p>

                    </div>


                    <button
                    onClick={() =>
                        navigate("/projects/new")
                    }
                    className="mt-5 rounded-lg bg-[#A78BFA] px-5 py-2.5 text-sm font-semibold text-[#111318] transition hover:bg-[#8B5CF6] hover:text-white"
                >
                    + Create Project
                </button>

                </div>


                {/* ================= GLOBAL STATS ================= */}

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <DashboardStat
                        title="Total Events"
                        value={stats.totalEvents.toLocaleString()}
                        change=""
                        description="All events"
                    />

                    <DashboardStat
                        title="Errors"
                        value={stats.errors.toLocaleString()}
                        change=""
                        description="Failed events"
                        positive={false}
                    />

                    <DashboardStat
                        title="Average Latency"
                        value={`${(stats.averageLatency / 1000).toFixed(2)}s`}
                        change=""
                        description="Across all events"
                    />

                    <DashboardStat
                        title="Estimated Cost"
                        value={`$${stats.estimatedCost.toFixed(2)}`}
                        change=""
                        description="Current usage"
                    />

                </div>

                {/* ================= CONTENT GRID ================= */}

                <div className="grid gap-6 xl:grid-cols-[1fr_350px]">


                    {/* ================= PROJECTS ================= */}

                    <section>

                        <div className="mb-4 flex items-center justify-between">

                            <div>

                                <h2 className="text-lg font-semibold">
                                    Projects
                                </h2>

                                <p className="mt-1 text-xs text-[#8B93A7]">
                                    Your monitored AI
                                    applications
                                </p>

                            </div>

                            {loading && (
                                <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-8 text-center text-sm text-[#8B93A7]">
                                    Loading projects...
                                </div>
                            )}

                            <span className="text-xs text-[#5F6675]">
                                {projects.length} projects
                            </span>

                        </div>


                        <div className="space-y-3">

                            {projects.map(
                                (project) => (
                                    <ProjectCard
                                        key={
                                            project.id
                                        }
                                        project={
                                            project
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/projects/${project.id}`
                                            )
                                        }
                                    />
                                )
                            )}

                        </div>

                    </section>


                    {/* ================= RIGHT COLUMN ================= */}

                    <aside className="space-y-6">


                        {/* Getting Started */}

                        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-5">

                            <div className="mb-5">

                                <div className="flex items-center justify-between">

                                    <h2 className="font-semibold">
                                        Get started
                                    </h2>

                                    <span className="text-xs text-[#8B93A7]">
                                        {completedSteps}/4
                                    </span>

                                </div>

                                <p className="mt-1 text-xs leading-5 text-[#8B93A7]">
                                    Connect your first
                                    application.
                                </p>

                            </div>


                            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-[#2A2F3A]">

                                <div
                                    className="h-full rounded-full bg-[#A78BFA] transition-all"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />

                            </div>

                            {/* Steps */}

                            <div className="space-y-2">

                                {setupSteps.map((step) => (

                                    <div
                                        key={step.number}
                                        className="flex items-center gap-3 rounded-lg px-2 py-2"
                                    >

                                        <div
                                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                                step.completed
                                                    ? "bg-[#A78BFA] text-[#111318]"
                                                    : "border border-[#3A4050] text-[#8B93A7]"
                                            }`}
                                        >
                                            {step.completed
                                                ? "✓"
                                                : step.number}
                                        </div>

                                        <span
                                            className={`text-sm ${
                                                step.completed
                                                    ? "text-white"
                                                    : "text-[#8B93A7]"
                                            }`}
                                        >
                                            {step.title}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
}


/* ================= STAT ================= */

function DashboardStat({
    title,
    value,
    change,
    description,
    positive = false,
}: {
    title: string;
    value: string;
    change: string;
    description: string;
    positive?: boolean;
}) {
    return (
        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-5">

            <p className="text-xs text-[#8B93A7]">
                {title}
            </p>

            <div className="mt-2 flex items-end justify-between gap-3">

                <span className="text-2xl font-bold">
                    {value}
                </span>

                <span
                    className={
                        positive
                            ? "text-xs font-medium text-[#34D399]"
                            : "text-xs font-medium text-[#FB7185]"
                    }
                >
                    {change}
                </span>

            </div>

            <p className="mt-1 text-xs text-[#5F6675]">
                {description}
            </p>

        </div>
    );
}


/* ================= PROJECT CARD ================= */

function ProjectCard({
    project,
    onClick,
}: {
    project: Project;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group w-full rounded-xl border border-[#2A2F3A] bg-[#181B22] p-5 text-left transition hover:border-[#3A4050] hover:bg-[#20242D]"
        >

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#242036] text-[#A78BFA]">
                        ◈
                    </div>

                    <div>

                        <h3 className="font-semibold transition group-hover:text-[#A78BFA]">
                            {project.name}
                        </h3>

                        <p className="mt-1 text-xs text-[#8B93A7]">
                            {project.description}
                        </p>

                    </div>

                </div>


                <div className="grid grid-cols-3 gap-4">

                        <div>
                            <p className="text-[11px] text-[#5F6675]">
                                Events
                            </p>

                            <p className="mt-1 text-sm text-[#CBD5E1]">
                                {(project.events ?? 0).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] text-[#5F6675]">
                                Errors
                            </p>

                            <p className="mt-1 text-sm text-[#CBD5E1]">
                                {(project.errors ?? 0).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] text-[#5F6675]">
                                Latency
                            </p>

                            <p className="mt-1 text-sm text-[#CBD5E1]">
                                {project.latency ?? "0ms"}
                            </p>
                        </div>

                </div>


                <span
                    className={
                        (project.errors ?? 0) > 0
                            ? "hidden text-xs text-[#FBBF24] sm:block"
                            : "hidden text-xs text-[#34D399] sm:block"
                    }
                >
                    ●{" "}
                    {(project.errors ?? 0) > 0
                        ? "Needs attention"
                        : "Healthy"}
                </span>

            </div>

        </button>
    );
}


