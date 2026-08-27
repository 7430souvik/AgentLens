type ModelRowProps = {
    model: string;
    requests: string;
    percentage: string;
};

export default function ModelRow({
    model,
    requests,
    percentage,
}: ModelRowProps) {
    return (
        <div className="mt-5">

            <div className="flex items-center justify-between">

                <div className="min-w-0">
                    <p className="truncate font-mono text-sm text-[#CBD5E1]">
                        {model}
                    </p>

                    <p className="mt-1 text-xs text-[#5F6675]">
                        {requests} requests
                    </p>
                </div>

                <span className="ml-4 shrink-0 text-xs text-[#8B93A7]">
                    {percentage}
                </span>

            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#2A2F3A]">
                <div
                    className="h-full rounded-full bg-[#A78BFA]"
                    style={{
                        width: percentage,
                    }}
                />
            </div>

        </div>
    );
}