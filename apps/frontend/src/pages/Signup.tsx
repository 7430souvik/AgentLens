import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

export default function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [, setError] = useState("");

     const handleSignup = async () => {
        if (!name || !email || !password) {
            setError(
                "Name, email and password are required"
            );
            return;
        }

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters"
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/auth/signup",
                {
                    name: name.trim(),
                    email: email
                        .trim()
                        .toLowerCase(),
                    password,
                }
            );

            console.log(
                "SIGNUP SUCCESS:",
                response.data
            );

            navigate("/login");

        } catch (error: any) {
            console.error(
                "SIGNUP ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create account"
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#111318] text-white">

            {/* Header */}

            <header className="border-b border-[#2A2F3A]">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10">

                    <div
                        onClick={() => navigate("/")}
                        className="flex cursor-pointer items-center gap-2.5"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA] font-extrabold text-[#111318]">
                            A
                        </div>

                        <span className="text-xl font-bold">
                            AgentLens
                        </span>
                    </div>

                    <div className="text-sm text-[#8B93A7]">
                        Already have an account?

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                            className="ml-2 font-medium text-[#A78BFA] hover:text-[#8B5CF6]"
                        >
                            Sign in
                        </button>
                    </div>

                </div>
            </header>


            {/* Signup */}

            <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">

                <div className="w-full max-w-md">

                    {/* Heading */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#242036] text-xl text-[#A78BFA]">
                            ✦
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Create your account
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-[#8B93A7]">
                            Start monitoring your AI
                            applications with AgentLens.
                        </p>

                    </div>


                    {/* Card */}

                    <div className="rounded-2xl border border-[#2A2F3A] bg-[#181B22] p-7 shadow-2xl shadow-black/20">

                        {/* Name */}

                        <div className="mb-5">

                            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
                                Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="Your name"
                                className="w-full rounded-lg border border-[#2A2F3A] bg-[#111318] px-4 py-3 text-sm text-white outline-none placeholder:text-[#5F6675] transition focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA]"
                            />

                        </div>


                        {/* Email */}

                        <div className="mb-5">

                            <label className="mb-2 block text-sm font-medium text-[#CBD5E1]">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-[#2A2F3A] bg-[#111318] px-4 py-3 text-sm text-white outline-none placeholder:text-[#5F6675] transition focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA]"
                            />

                        </div>


                        {/* Password */}

                        <div className="mb-6">

                            <div className="mb-2 flex items-center justify-between">

                                <label className="block text-sm font-medium text-[#CBD5E1]">
                                    Password
                                </label>

                                <span className="text-xs text-[#5F6675]">
                                    Minimum 8 characters
                                </span>

                            </div>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-[#2A2F3A] bg-[#111318] px-4 py-3 text-sm text-white outline-none placeholder:text-[#5F6675] transition focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA]"
                            />

                        </div>


                        {/* Terms */}

                        <div className="mb-6 flex items-start gap-3">

                            <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 accent-[#A78BFA]"
                            />

                            <p className="text-xs leading-5 text-[#8B93A7]">
                                I agree to the{" "}
                                <span className="cursor-pointer text-[#A78BFA]">
                                    Terms of Service
                                </span>{" "}
                                and{" "}
                                <span className="cursor-pointer text-[#A78BFA]">
                                    Privacy Policy
                                </span>
                                .
                            </p>

                        </div>


                        {/* Submit */}

                        <button
                            type="button"
                            onClick={handleSignup}
                            disabled={loading}
                            className="w-full rounded-lg bg-[#A78BFA] px-4 py-3 text-sm font-semibold text-[#111318] transition hover:bg-[#8B5CF6] hover:text-white"
                        >
                            {loading
                                ? "Creating account..."
                                : "Create Account"}
                        </button>


                        {/* Divider */}

                        <div className="my-6 flex items-center gap-3">

                            <div className="h-px flex-1 bg-[#2A2F3A]" />

                            <span className="text-xs text-[#5F6675]">
                                OR
                            </span>

                            <div className="h-px flex-1 bg-[#2A2F3A]" />

                        </div>


                        {/* GitHub */}

                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#2A2F3A] bg-[#111318] px-4 py-3 text-sm font-medium text-[#CBD5E1] transition hover:border-[#3A4050] hover:bg-[#20242D]">

                            <span className="text-base">
                                ◉
                            </span>

                            Continue with GitHub

                        </button>

                    </div>


                    {/* Security note */}

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#5F6675]">

                        <span className="text-[#34D399]">
                            ✓
                        </span>

                        Your data is securely stored.

                    </div>

                </div>

            </main>

        </div>
    );
}