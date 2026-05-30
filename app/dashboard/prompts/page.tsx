import { NewPromptEditor } from "@/components/ui/NewPromptEditor";
import { ExistingPromptEditor } from "@/components/ui/ExistingPromptEditor";

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/shdcn/tabs";

import { Sparkles, History } from "lucide-react";

export default function Page() {
    return (
        <main className="min-h-screen bg-zinc-50 px-8 py-10">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-start justify-between">
                    <div>

                        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-zinc-950">
                            Prompts
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                            Create, test, and version prompts for AI applications.
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="new" className="space-y-6">
                    <div className="rounded-2xl border bg-white p-2 shadow-sm">
                        <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-zinc-100">
                            <TabsTrigger
                                value="new"
                                className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                <Sparkles className="h-4 w-4" />
                                New Prompt
                            </TabsTrigger>

                            <TabsTrigger
                                value="existing"
                                className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                <History className="h-4 w-4" />
                                Existing Prompt
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="new" className="mt-0">
                        <NewPromptEditor />
                    </TabsContent>

                    <TabsContent value="existing" className="mt-0">
                        <ExistingPromptEditor />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}