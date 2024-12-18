import React from 'react';

type MacroPieChartProps = {
    kcal?: number | null;
    fat?: number | null;
    carb?: number | null;
    protein?: number | null;
    size: number;
    thickness: number;
};

const MacroPieChart: React.FC<MacroPieChartProps> = ({ kcal, fat = 0, carb = 0, protein = 0, size, thickness }) => {
    // Compute calories from macros if kcal is not provided
    const fatCalories = (fat || 0) * 9;
    const carbCalories = (carb || 0) * 4;
    const proteinCalories = (protein || 0) * 4;

    const computedKcal = Math.round(fatCalories + carbCalories + proteinCalories);
    const totalCalories = kcal || computedKcal;

    // Avoid division by zero if totalCalories is 0
    const fatPercent = totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;
    const carbPercent = totalCalories > 0 ? (carbCalories / totalCalories) * 100 : 0;
    const proteinPercent = totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;

    // Circle calculations
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    const fatArc = (fatPercent / 100) * circumference;
    const carbsArc = (carbPercent / 100) * circumference;
    const proteinArc = (proteinPercent / 100) * circumference;

    return (
        <div className='-m-[1px] p-[1px]'>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="circular-chart"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    className="circle-bg stroke-muted-foreground"
                    strokeWidth={thickness}
                />

                {/* Fat arc */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    className="stroke-orange-500"
                    strokeWidth={thickness}
                    strokeDasharray={`${fatArc} ${circumference - fatArc}`}
                    strokeDashoffset="0"
                    style={{ transform: `rotate(-90deg)`, transformOrigin: '50% 50%' }}
                />

                {/* Carbs arc */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    className="stroke-green-500"
                    strokeWidth={thickness}
                    strokeDasharray={`${carbsArc} ${circumference - carbsArc}`}
                    strokeDashoffset={-fatArc}
                    style={{ transform: `rotate(-90deg)`, transformOrigin: '50% 50%' }}
                />

                {/* Protein arc */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    className="stroke-blue-500"
                    strokeWidth={thickness}
                    strokeDasharray={`${proteinArc} ${circumference - proteinArc}`}
                    strokeDashoffset={-(fatArc + carbsArc)}
                    style={{ transform: `rotate(-90deg)`, transformOrigin: '50% 50%' }}
                />
            </svg>
        </div>
    );
};

export default MacroPieChart;
