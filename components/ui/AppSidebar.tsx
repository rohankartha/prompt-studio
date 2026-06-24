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
    Plus,
    History,
    Play
} from "lucide-react";

import { usePathname } from "next/navigation";

import Image from "next/image";

const sections = [
    {
        title: "Prompts",
        items: [
            {
                title: "Create New Prompt",
                href: "/dashboard/prompts/new",
                icon: Plus,
            },
            {
                title: "Update Existing Prompt",
                href: "/dashboard/prompts/existing",
                icon: History,
            },
            {
                title: "Run Prompt",
                href: "/dashboard/prompts/run",
                icon: Play
            }
        ],
    },
    {
        title: "Datasets",
        items: [
            {
                title: "Create New Dataset",
                href: "/dashboard/datasets/new",
                icon: Activity,
            },
            {
                title: "View All Datasets",
                href: "/dashboard/datasets",
                icon: BarChart3,
            },
        ],
    },
    {
        title: "Evaluations",
        items: [
            {
                title: "View Status Table",
                href: "/dashboard/runs",
                icon: Activity,
            },
            {
                title: "Run New Evaluation",
                href: "/dashboard/datasets",
                icon: BarChart3,
            },
        ],
    },
    {
        title: "Settings",
        items: [
            {
                title: "Keys",
                href: "/dashboard/keys",
                icon: Key,
            },
        ],
    },
];


export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar className="border-r border-zinc-200 bg-white">
            <SidebarContent className="flex h-full flex-col bg-white">
                <div className="flex items-center gap-3 py-6 px-6">
                    <Image
                        src="/quill.png"
                        alt="Quill Logo"
                        width={36}
                        height={36}
                    />

                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                        Quill
                    </h1>
                </div>

                {sections.map((section) => (
                    <SidebarGroup
                        key={section.title}
                        className="px-3 py-4"
                    >
                        <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                            {section.title}
                        </div>

                        <SidebarMenu>
                            {section.items.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    )
};

// {/*                 
                


//                         <div className="border-t border-zinc-200 p-4">
//                             <Show when="signed-out">
//                                 <div className="space-y-2">
//                                     <SignInButton>
//                                         <button className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50">
//                                             Sign In
//                                         </button>
//                                     </SignInButton>

//                                     <SignUpButton>
//                                         <button className="w-full rounded-xl bg-zinc-950 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800">
//                                             Sign Up
//                                         </button>
//                                     </SignUpButton>
//                                 </div>
//                             </Show>

//                             <Show when="signed-in">
//                                 <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
//                                     <span className="text-sm font-medium text-zinc-700">
//                                         Account
//                                     </span>
//                                     <UserButton />
//                                 </div>
//                             </Show>
//                         </div>
//                     </SidebarContent>
//     </Sidebar>
//             );
// }}} */}