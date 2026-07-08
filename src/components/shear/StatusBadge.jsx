const statusConfig = {
    active: {
        label: "Active",
        // custom dynamic shadow/glow matching the color
        dot: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]",
        className: "border-green-200 bg-green-50 text-green-700",
    },
    pending: {
        label: "Pending",
        dot: "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]",
        className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    },
    inactive: {
        label: "Inactive",
        dot: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]",
        className: "border-red-200 bg-red-50 text-red-700",
    },
};

const StatusBadge = ({ status }) => {
    const config =
        statusConfig[status?.toLowerCase()] || {
            label: "Unknown",
            dot: "bg-gray-500 shadow-[0_0_10px_rgba(107,114,128,0.2)]",
            className: "border-gray-200 text-gray-700 bg-gray-50",
        };

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

export default StatusBadge;
