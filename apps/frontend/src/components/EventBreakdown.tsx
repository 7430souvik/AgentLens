type EventBreakdownProps = {
    type: string;
    count: string;
    percentage: string;
    error?: boolean;
};

export default function EventBreakdown({
    type,
    count,
    percentage,
    error = false,
}: EventBreakdownProps) {
    return (
        <div className="border-b border-[#2A2F3A] px-5 py-4 last:border-b-0">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <span
                        className={`h-2 w-2 rounded-full ${
                            error
                                ? "bg-[#FB7185]"
                                : "bg-[#A78BFA]"
                        }`}
                    />

                    <span className="font-mono text-sm text-[#CBD5E1]">
                        {type}
                    </span>

                </div>

                <div className="flex items-center gap-5">

                    <span className="text-sm text-[#CBD5E1]">
                        {count}
                    </span>

                    <span className="w-12 text-right text-xs text-[#8B93A7]">
                        {percentage}
                    </span>

                </div>

            </div>

        </div>
    );
}