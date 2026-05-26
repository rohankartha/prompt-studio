"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/shdcn/sidebar";

import Link from "next/link";
import { FileText, Database, BarChart3, Key } from "lucide-react";

const items = [
    {
        title: "Prompts",
        href: "/dashboard/prompts",
        icon: FileText,
    },
    {
        title: "Datasets",
        href: "/dashboard/datasets",
        icon: Database,
    },
    {
        title: "Evaluations",
        href: "/dashboard/evaluations",
        icon: BarChart3,
    },
    {
        title: "Keys",
        href: "/dashboard/keys",
        icon: Key,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent className="bg-muted">
                <div className="px-4 py-6">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Prompt Studio
                    </h1>
                    <p className="mt-1 text-sm">
                        Evaluate prompts and datasets
                    </p>
                </div>

                <SidebarGroup>


                    <SidebarMenu className="space-y-1 px-2">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    className="h-11 text-base rounded-lg hover:bg-zinc-800 hover:text-white"
                                >
                                    <Link href={item.href}>
                                        <item.icon className="!h-6 !w-6" />
                                        <span className="ml-5">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}