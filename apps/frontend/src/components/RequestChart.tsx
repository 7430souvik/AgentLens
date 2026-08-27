type RequestVolume = {
    time: string;
    count: number;
};

type RequestChartProps = {
    data?: RequestVolume[];
};

export default function RequestChart({
    data = [],
}: RequestChartProps) {

    // --------------------------------
    // Empty state
    // --------------------------------

    if (data.length === 0) {
        return (
            <div className="flex h-[280px] items-center justify-center">
                <div className="text-center">

                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#242036] text-[#A78BFA]">
                        ↗
                    </div>

                    <p className="text-sm text-[#8B93A7]">
                        No requests yet
                    </p>

                    <p className="mt-1 text-xs text-[#5F6675]">
                        Request volume will appear once
                        your application sends events.
                    </p>

                </div>
            </div>
        );
    }

    // --------------------------------
    // Calculate chart dimensions
    // --------------------------------

    const maxCount = Math.max(
        ...data.map((item) => item.count),
        1
    );

    const chartHeight = 220;
    const chartWidth = 900;

    const horizontalPadding = 20;
    const verticalPadding = 20;

    const usableWidth =
        chartWidth - horizontalPadding * 2;

    const usableHeight =
        chartHeight - verticalPadding * 2;

    const getX = (index: number) => {

        if (data.length === 1) {
            return chartWidth / 2;
        }

        return (
            horizontalPadding +
            (index / (data.length - 1)) *
                usableWidth
        );
    };

    const getY = (count: number) => {

        return (
            verticalPadding +
            usableHeight -
            (count / maxCount) *
                usableHeight
        );
    };

    // --------------------------------
    // Generate SVG points
    // --------------------------------

    const points = data
        .map(
            (item, index) =>
                `${getX(index)},${getY(item.count)}`
        )
        .join(" ");

    // --------------------------------
    // Render
    // --------------------------------

    return (
        <div className="w-full">

            {/* Chart */}

            <div className="relative h-[280px] w-full overflow-hidden">

                <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    preserveAspectRatio="none"
                    className="h-full w-full"
                >

                    {/* Horizontal grid lines */}

                    <line
                        x1="20"
                        y1="20"
                        x2="880"
                        y2="20"
                        stroke="#2A2F3A"
                        strokeWidth="1"
                    />

                    <line
                        x1="20"
                        y1="75"
                        x2="880"
                        y2="75"
                        stroke="#2A2F3A"
                        strokeWidth="1"
                    />

                    <line
                        x1="20"
                        y1="130"
                        x2="880"
                        y2="130"
                        stroke="#2A2F3A"
                        strokeWidth="1"
                    />

                    <line
                        x1="20"
                        y1="185"
                        x2="880"
                        y2="185"
                        stroke="#2A2F3A"
                        strokeWidth="1"
                    />

                    <line
                        x1="20"
                        y1="240"
                        x2="880"
                        y2="240"
                        stroke="#2A2F3A"
                        strokeWidth="1"
                    />


                    {/* Area */}

                    <polygon
                        points={`
                            ${horizontalPadding},${chartHeight - verticalPadding}
                            ${points}
                            ${chartWidth - horizontalPadding},${chartHeight - verticalPadding}
                        `}
                        fill="rgba(167, 139, 250, 0.08)"
                    />


                    {/* Line */}

                    <polyline
                        points={points}
                        fill="none"
                        stroke="#A78BFA"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />


                    {/* Data points */}

                    {data.map(
                        (item, index) => (
                            <circle
                                key={`${item.time}-${index}`}
                                cx={getX(index)}
                                cy={getY(
                                    item.count
                                )}
                                r="4"
                                fill="#181B22"
                                stroke="#A78BFA"
                                strokeWidth="2"
                            />
                        )
                    )}

                </svg>

            </div>


            {/* X-axis labels */}

            <div className="mt-2 flex justify-between px-2">

                {data.map(
                    (item, index) => {

                        // Show only a reasonable
                        // number of labels.

                        if (
                            data.length > 8 &&
                            index %
                                Math.ceil(
                                    data.length / 8
                                ) !==
                                0
                        ) {
                            return null;
                        }

                        return (
                            <span
                                key={`${item.time}-label-${index}`}
                                className="text-[10px] text-[#5F6675]"
                            >
                                {item.time}
                            </span>
                        );
                    }
                )}

            </div>


            {/* Summary */}

            <div className="mt-5 flex items-center justify-between border-t border-[#2A2F3A] pt-4">

                <div>
                    <p className="text-xs text-[#5F6675]">
                        Total requests
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#CBD5E1]">
                        {data
                            .reduce(
                                (
                                    total,
                                    item
                                ) =>
                                    total +
                                    item.count,
                                0
                            )
                            .toLocaleString()}
                    </p>
                </div>


                <div className="text-right">

                    <p className="text-xs text-[#5F6675]">
                        Peak
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#CBD5E1]">
                        {maxCount.toLocaleString()}
                    </p>

                </div>

            </div>

        </div>
    );
}