import React, { useState } from "react";

export const SensitiveChoice = ({ children }: { children: React.ReactNode }) => {
    const [choice, setChoice] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChoice(e.target.value);
    };

    return (
        <div className="flex gap-4 items-center">
            <span>This jokes may contain explicit content. Can we show it ?</span>

            <label className="flex items-center gap-1">
                <input
                    type="radio"
                    name="sensitive"
                    value="yes"
                    checked={choice === "yes"}
                    onChange={handleChange}
                />
                <span>Yes</span>
            </label>

            <label className="flex items-center gap-1">
                <input
                    type="radio"
                    name="sensitive"
                    value="no"
                    checked={choice === "no"}
                    onChange={handleChange}
                />
                <span>No</span>
            </label>
            <div style={{
                filter: choice === "yes" ? 'none' : 'blur(10px)',
            }}>
                {children}
            </div>
        </div>
    );
};
