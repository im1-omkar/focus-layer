interface Ritual {
    id: string;
    title: string;
    isActive: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

type GroupedLogs = Record<string, Record<string, number | null>>;

interface ActiveLogsTableProps {
    rituals: Ritual[];
    logsGroupedByDate: GroupedLogs;
    uniqueDates: string[];
}

const ActiveLogsTable = ({
    rituals,
    logsGroupedByDate,
    uniqueDates,
}: ActiveLogsTableProps) => {
    return (
        <div>
            <div>Active Logs Section</div>

            <table>
                <thead>
                    <tr>
                        <th className="border p-2 bg-orange-300">Date</th>

                        {rituals.map(
                            (ritual) =>
                                ritual.isActive && (
                                    <th key={ritual.id} className="border p-2">
                                        {ritual.title}
                                    </th>
                                )
                        )}

                        <th className="border p-2 bg-green-300">Total Score</th>
                    </tr>
                </thead>

                <tbody>
                    {uniqueDates.map((date) => {
                        const dailyScores = logsGroupedByDate[date];

                        return (
                            <tr key={date}>
                                <td className="border p-2 bg-orange-300">
                                    {date}
                                </td>

                                {rituals.map((ritual) => {
                                    if (!ritual.isActive) return null;

                                    const score = dailyScores[ritual.title];

                                    return (
                                        <td
                                            key={ritual.id}
                                            className="border p-2 text-center"
                                        >
                                            {score ?? "-"}
                                        </td>
                                    );
                                })}

                                <td className="border p-2 bg-green-300 text-center font-bold">
                                    {rituals.reduce((total, ritual) => {
                                        const score = dailyScores[ritual.title];

                                        if (
                                            ritual.isActive &&
                                            typeof score === "number"
                                        ) {
                                            return total + score;
                                        }

                                        return total;
                                    }, 0)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ActiveLogsTable;