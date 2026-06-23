import React from 'react';
import './Heatmap.css';

// 1. Define the shape of your backend data
export interface HeatmapDataPoint {
    date: string;
    totalScore: number;
}

// 2. Define the component props
interface HeatmapProps {
    data: HeatmapDataPoint[];
}

// 3. Define the shape of our normalized internal state
interface NormalizedDay {
    date: string;
    score: number;
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
    // Convert the array into a typed dictionary (Record) for fast lookups
    const dataMap: Record<string, number> = data.reduce((acc, item) => {
        acc[item.date] = item.totalScore;
        return acc;
    }, {} as Record<string, number>);

    // Generate the padded array of exactly 365 days
    const generateDates = (): NormalizedDay[] => {
        const dates: NormalizedDay[] = [];
        // Hardcoded for your example, but usually you'd use `new Date()`
        const currentDate = new Date('2026-06-23');
        currentDate.setDate(currentDate.getDate() - 364);

        for (let i = 0; i < 365; i++) {
            const dateString = currentDate.toISOString().split('T')[0];
            dates.push({
                date: dateString,
                score: dataMap[dateString] || 0, // Fallback to 0 if no backend data
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const heatmapDates = generateDates();

    return (
        <div className="heatmap-wrapper">
            {/* Month Header */}
            <div className="months-header">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
                <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>

            <div className="heatmap-body">
                {/* Day of Week Sidebar */}
                <div className="days-sidebar">
                    <span></span> {/* Sun */}
                    <span>Mon</span>
                    <span></span> {/* Tue */}
                    <span>Wed</span>
                    <span></span> {/* Thu */}
                    <span>Fri</span>
                    <span></span> {/* Sat */}
                </div>

                {/* The Grid */}
                <div className="heatmap-grid">
                    {heatmapDates.map((day, index) => {
                        // Cap score at 4 for standard GitHub colors
                        const scoreClass = `score-${Math.min(day.score, 4)}`;

                        return (
                            <div
                                key={index}
                                className={`heatmap-cell ${scoreClass}`}
                                title={`scored ${day.score} Points on ${day.date}`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Heatmap;