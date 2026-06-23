import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

interface Ritual {
    id: string;
    title: string;
    isActive: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

type GroupedLogs = Record<string, Record<string, number | null>>;

interface Log {
    ritualId: string;
    date: string;
    score: number;
}

type PostHandlerInterface =
    | {
        ritualId: string;
        date: string;
        score: number;
    }
    | {
        logs: Log[];
    };

interface ActiveLogsTableProps {
    rituals: Ritual[];
    logsGroupedByDate: GroupedLogs;
    uniqueDates: string[];
    postLogsMutation: UseMutationResult<any, Error, PostHandlerInterface, unknown>
}

const ActiveLogsTable = ({
    rituals,
    logsGroupedByDate,
    uniqueDates,
    postLogsMutation
}: ActiveLogsTableProps) => {

    const [editingCell, setEditingCell] = useState<{
        date: string;
        ritualId: string;
    } | null>(null);

    const [inputValue, setInputValue] = useState("");

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
                                            onDoubleClick={() => {
                                                setEditingCell({
                                                    date,
                                                    ritualId: ritual.id,
                                                });

                                                setInputValue(
                                                    score !== undefined && score !== null
                                                        ? String(score)
                                                        : ""
                                                );
                                            }}
                                        >
                                            {editingCell?.date === date &&
                                                editingCell?.ritualId === ritual.id ? (
                                                <input
                                                    autoFocus
                                                    value={inputValue}
                                                    onChange={(e) => {
                                                        const value = e.target.value;

                                                        // only allow empty, 0,1,2,3
                                                        if (
                                                            value === "" ||
                                                            ["0", "1", "2", "3"].includes(value)
                                                        ) {
                                                            setInputValue(value);
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        const numericValue =
                                                            inputValue === ""
                                                                ? null
                                                                : Number(inputValue);

                                                        // YOUR API HANDLER HERE
                                                        postLogsMutation.mutate({
                                                            date,
                                                            ritualId: ritual.id,
                                                            score: numericValue ? numericValue : 0,
                                                        });

                                                        setEditingCell(null);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.currentTarget.blur();
                                                        }
                                                    }}
                                                    className="w-12 text-center border rounded"
                                                />
                                            ) : (
                                                score ?? "-"
                                            )}
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