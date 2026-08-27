import { useNavigate } from "react-router-dom";

type SidebarProps = {
    projectId?: string;
    open: boolean;
    onClose: () => void;
};

export default function Sidebar({
    projectId,
    open,
    onClose,
}: SidebarProps) {
    const navigate = useNavigate();

    const goTo = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            {/* Overlay */}

            {open && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/50"
                />
            )}

            {/* Sidebar */}

            <aside
                className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-[#2A2F3A] bg-[#111318] transition-transform duration-300 ${
                    open
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >

                {/* Header */}

                <div className="flex h-[72px] items-center justify-between border-b border-[#2A2F3A] px-5">

                    <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA] font-bold text-[#111318]">
                            A
                        </div>

                        <span className="text-xl font-bold">
                            AgentLens
                        </span>

                    </div>

                    <button
                        onClick={onClose}
                        className="text-xl text-[#8B93A7] hover:text-white"
                    >
                        ×
                    </button>

                </div>


                {/* Navigation */}

                <div className="px-3 py-5">

                    <NavLabel label="Overview" />

                    <NavItem
                        label="Dashboard"
                        icon="▣"
                        onClick={() =>
                            goTo("/dashboard")
                        }
                    />


                    <NavLabel label="Project" />

                    <NavItem
                        label="Projects"
                        icon="◈"
                        onClick={() =>
                            goTo("/dashboard")
                        }
                    />

                    {projectId && (
                        <NavItem
                            label="API Keys"
                            icon="⚿"
                            onClick={() =>
                                goTo(
                                    `/projects/${projectId}/keys`
                                )
                            }
                        />
                    )}


                    <NavLabel label="Observability" />

                    {projectId && (
                        <>
                            <NavItem
                                label="Events"
                                icon="◉"
                                onClick={() =>
                                    goTo(
                                        `/projects/${projectId}/events`
                                    )
                                }
                            />

                            <NavItem
                                label="Traces"
                                icon="◇"
                                onClick={() =>
                                    goTo(
                                        `/projects/${projectId}/traces`
                                    )
                                }
                            />

                            <NavItem
                                label="Errors"
                                icon="⚠"
                                onClick={() =>
                                    goTo(
                                        `/projects/${projectId}/errors`
                                    )
                                }
                            />
                        </>
                    )}


                    <NavLabel label="Developer" />

                    <NavItem
                        label="Docs"
                        icon="◧"
                        onClick={() =>
                            goTo("/docs")
                        }
                    />

                </div>

            </aside>
        </>
    );
}


function NavLabel({
    label,
}: {
    label: string;
}) {
    return (
        <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#5F6675] first:mt-0">
            {label}
        </p>
    );
}


function NavItem({
    label,
    icon,
    onClick,
}: {
    label: string;
    icon: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#8B93A7] transition hover:bg-[#181B22] hover:text-white"
        >
            <span className="w-5 text-center">
                {icon}
            </span>

            {label}
        </button>
    );
}