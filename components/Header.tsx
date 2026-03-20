"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Header() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-[#111827] border-b border-gray-300 dark:border-[#374151]">
            <div className="flex items-center justify-between gap-[15px] md:gap-[20px] lg:gap-[30px] px-4 md:px-8 lg:px-[50px] py-[15px] lg:py-[20px]">
                {/* Logo */}
                <Link className="flex items-center gap-[12px] md:gap-[15px] lg:gap-[20px] flex-shrink-0" href="/">
                    <div className="hidden sm:block">
                        <h1 className="text-gray-900 dark:text-[#F3F4F6] text-[18px] md:text-[20px] lg:text-[24px] font-bold leading-tight">
                            Карта маєтностей
                        </h1>
                        <p className="text-gray-700 dark:text-white text-[11px] md:text-[12px] lg:text-[13px] opacity-80 leading-tight mt-[2px]">
                            від творців Інвентаріуму
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-[10px] md:gap-[12px] lg:gap-[15px]">
                    {/* Theme Toggle */}
                    {theme === 'light' ?
                        <button
                            aria-label="Перемкнути тему"
                            className="hidden xl:block p-[8px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#374151] transition-colors"
                            onClick={() => setTheme('dark')}
                        >

                            <Moon className="w-5 h-5 text-gray-900 dark:text-[#F3F4F6] cursor-pointer" />
                        </button>
                        :
                        <button
                            aria-label="Перемкнути тему"
                            className="hidden xl:block p-[8px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#374151] transition-colors"
                            onClick={() => setTheme('light')}
                        >

                            <Sun className="w-5 h-5 text-gray-900 dark:text-[#F3F4F6] cursor-pointer" />
                        </button>
                    }
                </div>
            </div>
        </header>
    );
}