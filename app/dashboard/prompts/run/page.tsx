
import { RunPromptDisplay } from "@/components/ui/RunPromptDisplay";



import { Sparkles, History } from "lucide-react";

export default function Page() {

    
    return (
        <main className="min-h-screen bg-zinc-50 px-8 py-10">
            <div className="mx-auto max-w-6xl space-y-8">




                        <RunPromptDisplay></RunPromptDisplay>

   

            </div>
        </main>
    );
}