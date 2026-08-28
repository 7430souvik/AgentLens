import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import Navbar from "./Navbar";

export default function CreateProject() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        e: any
    ) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Project name is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/api/projects",
                {
                    name: name.trim(),
                    description:
                        description.trim(),
                }
            );

            console.log(
                "PROJECT CREATED:",
                response.data
            );

            const project =
                response.data.project ||
                response.data;

            navigate(
                `/api/projects/${project.id}`
            );

        } catch (error: any) {
            console.error(
                "CREATE PROJECT ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create project"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#111318] text-white">

            {/* Navbar */}
            <Navbar/>


            {/* Main */}

            <main className="mx-auto max-w-2xl px-6 py-12">

                {/* Back */}

                <button
                    onClick={() =>
                        navigate("/dashboard")
                    }
                    className="mb-8 text-sm text-[#8B93A7] hover:text-[#A78BFA]"
                >
                    ← Back to Dashboard
                </button>


                {/* Header */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        Create a project
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#8B93A7]">
                        Create a project to start
                        monitoring your AI application
                        with AgentLens.
                    </p>

                </div>


                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-[#2A2F3A] bg-[#181B22]"
                >

                    <div className="space-y-6 p-6">

                        {/* Name */}

                        <div>

                            <label className="mb-2 block text-sm font-medium">
                                Project name
                            </label>

                            <input
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="e.g. Customer Support Agent"
                                className="w-full rounded-lg border border-[#2A2F3A] bg-[#111318] px-4 py-3 text-sm text-white outline-none placeholder:text-[#5F6675] focus:border-[#A78BFA]"
                            />

                            <p className="mt-2 text-xs text-[#5F6675]">
                                Choose a name that
                                identifies your AI
                                application.
                            </p>

                        </div>


                        {/* Description */}

                        <div>

                            <label className="mb-2 block text-sm font-medium">
                                Description
                                <span className="ml-1 text-[#5F6675]">
                                    (optional)
                                </span>
                            </label>

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="What does this application do?"
                                rows={4}
                                className="w-full resize-none rounded-lg border border-[#2A2F3A] bg-[#111318] px-4 py-3 text-sm text-white outline-none placeholder:text-[#5F6675] focus:border-[#A78BFA]"
                            />

                        </div>


                        {/* Error */}

                        {error && (
                            <div className="rounded-lg border border-[#FB7185]/20 bg-[#FB7185]/5 p-4 text-sm text-[#FB7185]">
                                {error}
                            </div>
                        )}

                    </div>


                    {/* Footer */}

                    <div className="flex items-center justify-end gap-3 border-t border-[#2A2F3A] p-5">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="rounded-lg border border-[#2A2F3A] px-4 py-2.5 text-sm text-[#CBD5E1] hover:bg-[#20242D]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-[#A78BFA] px-5 py-2.5 text-sm font-semibold text-[#111318] transition hover:bg-[#8B5CF6] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Project"}
                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
}