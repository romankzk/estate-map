"use client";

import { Moon, Shield, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    const { theme, setTheme } = useTheme();
    
    const searchParams = useSearchParams();
    const isAdmin = searchParams.get('isAdmin') || false;

    return (
        <header className="bg-white dark:bg-[#111827] border-b border-gray-300 dark:border-[#374151]">
            <div className="flex items-center justify-between gap-[15px] md:gap-[20px] lg:gap-[30px] px-4 md:px-8 lg:px-[50px] py-[15px] lg:py-[20px]">
                {/* Logo */}
                <Link className="flex items-center gap-[12px] md:gap-[15px] lg:gap-[20px] flex-shrink-0" href="/">
                    <Image height={45} width={45} src="/logo.png" alt="Logo"/>
                    <div className="sm:block">
                        <h1 className="text-gray-900 dark:text-[#F3F4F6] text-[18px] md:text-[20px] lg:text-[24px] font-bold leading-tight">
                            Ключ+
                        </h1>
                        <p className="text-gray-700 dark:text-white text-[11px] md:text-[12px] lg:text-[13px] opacity-80 leading-tight mt-[2px]">
                            Реєстр маєтків та староств
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-[10px] md:gap-[12px] lg:gap-[15px]">
                    {/* {isAdmin && ( */}
                        <Link
                            href="/estate-map/admin"
                            className="flex text-sm font-medium text-gray-900 dark:text-[#F3F4F6] hover:text-gray-700 dark:hover:text-[#F3F4F6] transition-colors"
                        >
                            <Shield className="w-5 h-5 mr-2" /> Панель адміністратора
                        </Link>
                    {/* )} */}
                    {/* Theme Toggle */}
                    {theme === 'light' ?
                        <button
                            aria-label="Перемкнути тему"
                            className="xl:block p-[8px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#374151] transition-colors"
                            onClick={() => setTheme('dark')}
                        >

                            <Moon className="w-5 h-5 text-gray-900 dark:text-[#F3F4F6] cursor-pointer" />
                        </button>
                        :
                        <button
                            aria-label="Перемкнути тему"
                            className="xl:block p-[8px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#374151] transition-colors"
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