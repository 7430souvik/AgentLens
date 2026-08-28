import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";

export default function ApiKey() {
    type ApiKeyData = {
    id: string;
    name: string;
    key?: string;
    keyPrefix: string;
    createdAt: string;
    lastUsedAt: string | null;
    };

    const navigate = useNavigate();
    
    const [copied, setCopied] = useState(false);

 

    const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([]);
    const [newApiKey, setNewApiKey] =useState<ApiKeyData | null>(null);

    const [showNewKey, setShowNewKey] =useState(false);
    const [loading, setLoading] = useState(false);
    const [, setError] = useState("");
    const { id } = useParams();
    const [revoking, setRevoking] = useState(false);

    const fetchApiKeys = async () => {
        if (!id) return;

        try {
            const response = await api.get(
                `/projects/${id}/keys`
            );

            console.log(
                "API KEYS:",
                response.data.apiKeys
            );

            setApiKeys(
                response.data.apiKeys ?? []
            );
        } catch (error) {
            console.error(
                "API KEYS ERROR:",
                error
            );
        }
    };

    useEffect(() => {fetchApiKeys();}, [id]);

   

    const handleGenerateKey = async () => {
        if (!id) {
            setError("Project ID is missing");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                `/projects/${id}/keys`,
                {
                    name: "Production Key",
                }
            );

            console.log(
                "API KEY RESPONSE:",
                response.data
            );

            const generatedKey =
                response.data.apiKey;

            // Show newly generated secret separately
            setNewApiKey(generatedKey);
            setShowNewKey(true);

            // Refresh all existing keys
            await fetchApiKeys();

        } catch (error: any) {
            console.error(
                "GENERATE API KEY ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to generate API key"
            );
        } finally {
            setLoading(false);
        }
    };

    

   const handleRevokeKey = async (
    keyId: string
    ) => {
        if (!id) return;

        const confirmed = window.confirm(
            "Are you sure you want to revoke this API key?"
        );

        if (!confirmed) return;

        try {
            setRevoking(true);
            setError("");

            await api.delete(
                `/projects/${id}/keys/${keyId}`
            );

            await fetchApiKeys();

        } catch (error: any) {
            console.error(
                "REVOKE API KEY ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to revoke API key"
            );
        } finally {
            setRevoking(false);
        }
    };


    const handleCopy = async(key: string) =>{
        try{
            await navigator.clipboard.writeText(key);

            setCopied(true);

            setTimeout(() =>{
                setCopied(false);
            },2000);

        }catch(error){
            console.error("copy api key error", error);
        }
    };
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


                    {/* Navigation */}

                    <div className="flex items-center gap-5">

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="text-sm text-[#8B93A7] transition hover:text-white"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigate("/keys")
                            }
                            className="rounded-lg bg-[#242036] px-3 py-2 text-sm font-medium text-[#A78BFA]"
                        >
                            API Keys
                        </button>

                    </div>

                </div>

            </nav>


            {/* ================= MAIN ================= */}

            <main className="mx-auto max-w-[1100px] px-6 py-10 lg:px-8">

                {/* Header */}

                <div className="mb-8">

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="mb-5 text-xs text-[#8B93A7] transition hover:text-[#A78BFA]"
                    >
                        ← Back to Dashboard
                    </button>

                    <h1 className="text-3xl font-bold tracking-tight">
                        API Keys
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8B93A7]">
                        API keys authenticate your
                        application when sending
                        telemetry to AgentLens.
                    </p>

                </div>


                {newApiKey?.key && (
                    <div className="mb-6 rounded-xl border border-[#A78BFA]/30 bg-[#181B22] p-5">

                        <div className="mb-4">
                            <h3 className="text-sm font-semibold">
                                New API key
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#8B93A7]">
                                Copy this key now. For security, you
                                won't be able to retrieve it again.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">

                            <div className="min-w-0 flex-1 overflow-x-auto rounded-lg border border-[#2A2F3A] bg-[#111318] px-4 py-3">
                                <code className="whitespace-nowrap text-xs text-[#A78BFA]">
                                    {showNewKey
                                        ? newApiKey.key
                                        : `${newApiKey.keyPrefix}••••••••••••`}
                                </code>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewKey((prev) => !prev)
                                }
                                className="shrink-0 rounded-lg border border-[#2A2F3A] px-3 py-2.5 text-xs text-[#CBD5E1] transition hover:bg-[#242036]"
                            >
                                {showNewKey
                                    ? "Hide key"
                                    : "Show key"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleCopy(newApiKey.key!)
                                }
                                className="shrink-0 rounded-lg border border-[#2A2F3A] px-3 py-2.5 text-xs text-[#CBD5E1] transition hover:bg-[#242036]"
                            >
                                {copied
                                    ? "Copied ✓"
                                    : "Copy"}
                            </button>

                        </div>

                    </div>
                )}


                {/* ================= WARNING ================= */}

                <div className="mb-6 flex gap-4 rounded-xl border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-5">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FBBF24]/10 text-[#FBBF24]">
                        !
                    </div>

                    <div>

                        <h3 className="text-sm font-semibold text-[#FBBF24]">
                            Keep your API keys private
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-[#8B93A7]">
                            Never expose an AgentLens
                            API key in frontend code,
                            public repositories, or
                            client-side applications.
                        </p>

                    </div>

                </div>


                {/* ================= CREATE KEY ================= */}

               

                <section className="rounded-xl border border-[#2A2F3A] bg-[#181B22]">

                    <div className="border-b border-[#2A2F3A] p-6">

                        <h2 className="font-semibold">
                            API Keys
                        </h2>

                        <p className="mt-1 text-xs text-[#8B93A7]">
                            API keys associated with this project.
                        </p>

                    </div>


                    

                    {/* Existing Keys */}

                        <div className="p-6">

                            {apiKeys.length === 0 ? (

                                <div className="rounded-lg border border-[#2A2F3A] bg-[#111318] p-6 text-center">

                                    <p className="text-sm text-[#8B93A7]">
                                        No API keys generated yet.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {apiKeys.map((key) => (

                                        <div
                                            key={key.id}
                                            className="rounded-lg border border-[#2A2F3A] bg-[#111318] p-5"
                                        >

                                            <div className="flex items-start justify-between gap-4">

                                                {/* Key information */}

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex items-center gap-3">

                                                        <p className="text-sm font-medium">
                                                            {key.name}
                                                        </p>

                                                        <span className="rounded-full bg-[#34D399]/10 px-2.5 py-1 text-[11px] text-[#34D399]">
                                                            Active
                                                        </span>

                                                    </div>


                                                    {/* Key */}

                                                    <div className="mt-3 flex items-center gap-2">

                                                        <code className="min-w-0 flex-1 truncate text-sm text-[#A78BFA]">
                                                            {key.keyPrefix}
                                                            {"••••••••••••"}
                                                        </code>

                                                        

                                                    </div>


                                                    <p className="mt-2 text-xs text-[#5F6675]">
                                                        Created{" "}
                                                        {new Date(
                                                            key.createdAt
                                                        ).toLocaleString()}
                                                    </p>

                                                </div>


                                                {/* Revoke */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRevokeKey(key.id)
                                                    }
                                                    disabled={revoking}
                                                    className="shrink-0 text-xs text-[#FB7185] transition hover:text-[#F43F5E] disabled:opacity-40"
                                                >
                                                    {revoking
                                                        ? "Revoking..."
                                                        : "Revoke"}
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}


                            {/* Generate */}

                            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#2A2F3A] pt-6">

                                <div>

                                    <p className="text-sm font-medium">
                                        Generate another key
                                    </p>

                                    <p className="mt-1 text-xs text-[#5F6675]">
                                        Create a separate key for another application.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={handleGenerateKey}
                                    disabled={loading}
                                    className="shrink-0 rounded-lg bg-[#A78BFA] px-4 py-2.5 text-sm font-semibold text-[#111318] transition hover:bg-[#8B5CF6] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "Generating..."
                                        : "+ Generate New Key"}
                                </button>

                            </div>

                        </div>
                </section>


                {/* ================= SDK ================= */}

                <section className="mt-6 rounded-xl border border-[#2A2F3A] bg-[#181B22] p-6">

                    <div className="mb-5">

                        <h2 className="font-semibold">
                            Connect your application
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-[#8B93A7]">
                            Add your API key to your
                            backend and start sending
                            events.
                        </p>

                    </div>


                    {/* Tabs */}

                    <div className="mb-4 flex gap-1 rounded-lg border border-[#2A2F3A] bg-[#111318] p-1">

                        <button className="rounded-md bg-[#242036] px-3 py-2 text-xs font-medium text-[#A78BFA]">
                            Node.js
                        </button>

                        <button className="rounded-md px-3 py-2 text-xs text-[#8B93A7]">
                            Python
                        </button>

                        <button className="rounded-md px-3 py-2 text-xs text-[#8B93A7]">
                            cURL
                        </button>

                    </div>


                    {/* Code */}

                    <div className="overflow-x-auto rounded-lg border border-[#2A2F3A] bg-[#111318] p-5">

                        <pre className="text-xs leading-6 text-[#CBD5E1]">
                         <code>
                                {`const AGENTLENS_API_KEY =
                                process.env.AGENTLENS_API_KEY;

                                await fetch(
                                "https://api.agentlens.dev/events",
                                {
                                    method: "POST",
                                    headers: {
                                    "Authorization":
                                        \`Bearer \${AGENTLENS_API_KEY}\`,
                                    "Content-Type":
                                        "application/json"
                                    },
                                    body: JSON.stringify({
                                    type: "llm.request",
                                    model: "gpt-5",
                                    status: "success"
                                    })
                                }
                                );`}
                            </code>
                        </pre>

                    </div>

                </section>


                {/* ================= SECURITY ================= */}

                <section className="mt-6 grid gap-4 md:grid-cols-3">

                    <SecurityCard
                        icon="✓"
                        title="Secure"
                        description="Keys are used only for authenticating your telemetry requests."
                    />

                    <SecurityCard
                        icon="◈"
                        title="Scoped"
                        description="Each key is associated with your AgentLens project."
                    />

                    <SecurityCard
                        icon="↻"
                        title="Rotatable"
                        description="Revoke compromised keys and generate new ones at any time."
                    />

                </section>

            </main>

        </div>
    );
}


/* ================= SECURITY CARD ================= */

function SecurityCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-xl border border-[#2A2F3A] bg-[#181B22] p-5">

            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#242036] text-[#A78BFA]">
                {icon}
            </div>

            <h3 className="text-sm font-semibold">
                {title}
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#8B93A7]">
                {description}
            </p>

        </div>
    );
}