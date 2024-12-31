"use client";
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const cycleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }
    };

    return (
        <button onClick={cycleTheme} aria-label="Toggle theme" className="flex items-center gap-2 w-full">
            {theme === "light" ? (
                <>
                    <Sun
                        key="light"
                        className="size-4"
                    />
                    Light theme
                </>
            ) : theme === "dark" ? (
                <>
                    <Moon
                        key="dark"
                        className="size-4"
                    />
                    Dark theme
                </>
            ) : (
                <>
                    <Laptop
                        key="system"
                        className="size-4"
                    />
                    System theme
                </>
            )}
        </button>
    );
}