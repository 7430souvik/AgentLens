import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";


export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const[loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleLogin = async(e:any) =>{
        e.preventDefault();
        console.log("1. LOGIN CLICKED");
        console.log("2. EMAIL:", email);
        console.log("3. PASSWORD PROVIDED:", !!password);
        if (!email || !password) {
            setError(
                "Email and password are required"
            );
            return;
        }

        try{
            console.log("5. STARTING REQUEST");
            setLoading(true);
            setError("");

            console.log("6. POST /auth/login");

            const response = await api.post(
                "/auth/login",
                {
                    email:email.trim().toLowerCase(),
                    password,
                }

            );
            console.log("7. RESPONSE RECEIVED");
            console.log("STATUS:", response.status);
            console.log("DATA:", response.data);

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/dashboard");

        }catch(error:any){
            console.error(
                "LOGIN ERROR:",
                error
            );
            console.log(
            "STATUS:",
            error.response?.status
        );

        console.log(
            "DATA:",
            error.response?.data
        )

            setError(
                error.response?.data?.message ||
                "Invalid email or password");

        }finally {
        setLoading(false);
    }
    
    }

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
                        Don't have an account?

                        <button
                            onClick={() =>
                                navigate("/signup")
                            }
                            className="ml-2 font-medium text-[#A78BFA] hover:text-[#8B5CF6]"
                        >
                            Create account
                        </button>
                    </div>

                </div>
            </header>


            {/* Login */}

            <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">

                <div className="w-full max-w-md">

                    {/* Heading */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#242036] text-xl text-[#A78BFA]">
                            ◈
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome back
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-[#8B93A7]">
                            Sign in to your AgentLens
                            workspace.
                        </p>

                    </div>


                    {/* Card */}

                    <div className="rounded-2xl border border-[#2A2F3A] bg-[#181B22] p-7 shadow-2xl shadow-black/20">

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

                        <div className="mb-3">

                            <div className="mb-2 flex items-center justify-between">

                                <label className="block text-sm font-medium text-[#CBD5E1]">
                                    Password
                                </label>

                                <button className="text-xs text-[#A78BFA] hover:text-[#8B5CF6]">
                                    Forgot password?
                                </button>

                            </div>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>{
                                    setPassword(
                                        e.target.value
                                    )
                                }}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-[#2A2F3A] bg-[#111318] px-4 py-3 text-sm text-white outline-none placeholder:text-[#5F6675] transition focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA]"
                            />

                        </div>

                        {
                            error &&(
                                <div className="mb-4 rounded-lg border border-[#7F1D1D] bg-[#2A1115] px-4 py-3 text-sm text-[#FB7185]">
                                    {error}

                                </div>

                            )
                        }


                        {/* Remember */}

                        <div className="mb-6 flex items-center gap-3">

                            <input
                                type="checkbox"
                                className="h-4 w-4 accent-[#A78BFA]"
                            />

                            <span className="text-xs text-[#8B93A7]">
                                Remember me
                            </span>

                        </div>


                        {/* Submit */}

                        <button
                            type="button"
                            onClick={handleLogin}
                            className="w-full rounded-lg bg-[#A78BFA] px-4 py-3 text-sm font-semibold text-[#111318] transition hover:bg-[#8B5CF6] hover:text-white"
                        >
                            {loading ? "Signing in..." : "Sign In"}
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


                    {/* Security */}

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#5F6675]">

                        <span className="text-[#34D399]">
                            ✓
                        </span>

                        Secure developer observability.

                    </div>

                </div>

            </main>

        </div>
    );
}