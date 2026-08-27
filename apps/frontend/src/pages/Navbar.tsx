import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

type NavbarProps = {
    projectId?: string;
};

export default function Navbar({
    projectId,
}: NavbarProps) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <Sidebar
                projectId={projectId}
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
            />

            <nav className="border-b border-[#2A2F3A] bg-[#111318]">
                <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">

                    {/* Hamburger */}
                    <div className="flex items-center gap-3">

                            {/* Hamburger */}
                            <button
                                onClick={() => setMenuOpen(true)}
                                className="rounded-lg border border-[#2A2F3A] px-3 py-2 text-xl text-[#CBD5E1] transition hover:bg-[#181B22]"
                            >
                                ☰
                            </button>

                            {/* Logo */}
                            <div
                                onClick={() => navigate("/dashboard")}
                                className="flex cursor-pointer items-center gap-2.5"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA] font-extrabold text-[#111318]">
                                    A
                                </div>

                                <span className="text-xl font-bold">
                                    AgentLens
                                </span>
                            </div>

                    </div>

                    {/* Right side */}

                    <div className="flex items-center gap-2 sm:gap-5">

                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="hidden rounded-lg bg-[#242036] px-3 py-2 text-sm font-medium text-[#A78BFA] sm:block"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigate("/docs")
                            }
                            className="hidden px-3 py-2 text-sm text-[#8B93A7] transition hover:text-white md:block"
                        >
                            Docs
                        </button>

                        <div className="ml-2 h-8 w-px bg-[#2A2F3A]" />

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                            className="px-2 py-2 text-sm text-[#8B93A7] transition hover:text-white"
                        >
                            Logout
                        </button>

                    </div>

                </div>
            </nav>
        </>
    );
}