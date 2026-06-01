"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/shdcn/sidebar";

import {
    Show,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";

import Link from "next/link";

import {
    FileText,
    Database,
    BarChart3,
    Activity,
    Key,
} from "lucide-react";

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
        title: "Runs",
        href: "/dashboard/runs",
        icon: Activity,
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
        <Sidebar className="border-r border-zinc-200 bg-white">
            <SidebarContent className="flex h-full flex-col bg-white">
                <div className="border-b border-zinc-200 px-6 py-6">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                        Prompt Studio
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        Evaluate prompts and datasets
                    </p>
                </div>

                <SidebarGroup className="flex-1 px-3 py-4">
                    <SidebarMenu className="space-y-1">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    className="h-11 rounded-xl text-zinc-700 transition-all hover:bg-zinc-900 hover:text-white data-[active=true]:bg-zinc-900 data-[active=true]:text-white"
                                >
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-3 px-3"
                                    >
                                        <item.icon className="h-5 w-5 shrink-0" />
                                        <span className="text-sm font-medium">
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <div className="border-t border-zinc-200 p-4">
                    <Show when="signed-out">
                        <div className="space-y-2">
                            <SignInButton>
                                <button className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50">
                                    Sign In
                                </button>
                            </SignInButton>

                            <SignUpButton>
                                <button className="w-full rounded-xl bg-zinc-950 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </div>
                    </Show>

                    <Show when="signed-in">
                        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                            <span className="text-sm font-medium text-zinc-700">
                                Account
                            </span>
                            <UserButton />
                        </div>
                    </Show>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}