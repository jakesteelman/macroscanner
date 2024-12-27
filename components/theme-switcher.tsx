"use client";

import { Button } from "@/components/ui/button";
import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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

    const cycleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={cycleTheme} aria-label="Toggle theme" className="w-9 h-9 p-1">
                    {theme === "light" ? (
                        <Sun
                            key="light"
                            size={16}
                            className="text-muted-foreground"
                        />
                    ) : theme === "dark" ? (
                        <Moon
                            key="dark"
                            size={16}
                            className="text-muted-foreground"
                        />
                    ) : (
                        <Laptop
                            key="system"
                            size={16}
                            className="text-muted-foreground"
                        />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                Toggle theme, currently{' '}{theme}
            </TooltipContent>
        </Tooltip>
    );
}