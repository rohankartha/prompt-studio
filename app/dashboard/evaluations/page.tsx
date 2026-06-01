import { EvaluationDisplay } from "@/components/ui/EvaluationDisplay";

export default function EvaluationsPage() {
    return (
        <main className="min-h-screen bg-zinc-50 px-8 py-10">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-start justify-between">
                    <div>

                        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-zinc-950">
                            Evaluations
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                            Measure prompt performance with benchmark results, and quality scoring.
                        </p>
                        

                    </div>
                </div>
            </div>
            <EvaluationDisplay></EvaluationDisplay>
        </main>
        
    );
}