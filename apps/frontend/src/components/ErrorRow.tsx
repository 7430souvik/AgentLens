type ErrorRowProps = {
    message: string;
    time: string;
    model: string;
};

export default function ErrorRow({
    message,
    time,
    model,
}: ErrorRowProps) {
    return (
        <div className="border-b border-[#2A2F3A] px-5 py-4 last:border-b-0">

            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                    <div className="flex items-center gap-2">

                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#FB7185]" />

                        <p className="truncate text-sm text-[#CBD5E1]">
                            {message}
                        </p>

                    </div>

                    <div className="mt-2 flex items-center gap-3 text-xs text-[#5F6675]">

                        <span>
                            {model}
                        </span>

                        <span>•</span>

                        <span>
                            {time}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}