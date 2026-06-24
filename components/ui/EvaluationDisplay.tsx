"use client";


import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/shdcn/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/shdcn/dialog";
import { Loader2 } from "lucide-react";
import { Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/shdcn/button";
import { Badge } from "@/components/ui/shdcn/badge";
import { ScrollArea } from "@/components/ui/shdcn/scroll-area";
import {
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shdcn/select";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/shdcn/checkbox";


type SummaryStatistics = {
    overallScore: number;
    passed: number;
    failed: number;
    avgLatency: number;
};


type Evaluation = {
    id: string;
    inputs: string[];
    expectedOutputs: string[];
    outputs: string[];
    judgeScores: number[];
    judgeReasoning: string[];
    latencies: number[];
};


type EvaluationListItem = {
    id: string;
};


export function EvaluationDisplay() {
    const [loading, setLoading] = useState(false);
    const [summaryStatistics, setSummaryStatistics] =
        useState<SummaryStatistics | null>(null);

    const [evaluationList, setEvaluationList] = useState<EvaluationListItem[]>([]);
    const [selectedCase, setSelectedCase] = useState(0);

    const [submittedForAnalysis, setSubmittedForAnalysis] = useState(false);

    const [evaluation, setEvaluation] = useState<Evaluation>({
        id: "",
        inputs: [],
        expectedOutputs: [],
        outputs: [],
        judgeScores: [],
        judgeReasoning: [],
        latencies: [],
    });

    const [improvePromptDialogOpen, setImprovePromptDialogOpen] = useState(false);

    const [promptImprovements, setPromptImprovements] = useState<string>("");
    const [loadingPromptImprovements, setLoadingPromptImprovements] = useState(false);

    const [failureAnalysis, setFailureAnalysis] = useState("");
    const [improvedPrompt, setImprovedPrompt] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);

    const [chooseOptions, setChooseOptions] = useState(true);

    useEffect(() => {
        async function retrieveEvaluationList() {
            const response = await fetch("/api/evaluations", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            setEvaluationList(result);
        }

        retrieveEvaluationList();
    }, []);

    async function retrieveEvaluationAndSummaryStatistics(evaluationId: string) {
        setLoading(true);

        const response = await fetch(`/api/evaluations/${evaluationId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        setSummaryStatistics(result.summaryStatistics);
        setEvaluation(result.table);

        setLoading(false);
    }

    async function handleImprovePrompt(evaluationId: string) {
        setLoadingPromptImprovements(true);
        const response = await fetch(`/api/improve-prompt/${evaluationId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await response.json();
        setRecommendation(result.recommendation);
        setImprovedPrompt(result.improvedPrompt)
        setLoadingPromptImprovements(false);
    }


    // Add/remove selected analysis to/from state if box is checked/unchecked
    const toggleAnalysis = (value: string) => {
        setSelectedAnalyses((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const resetImprovePromptDialog = () => {
        setChooseOptions(true);
        setSelectedAnalyses([]);
        setRecommendation("");
        setImprovedPrompt("");
        setLoadingPromptImprovements(false);
        setSubmittedForAnalysis(false);
    };


    return (
        <main className="min-h-screen bg-zinc-50 py-4">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="flex items-center gap-3">
                    <Select
                        value={evaluation.id}
                        onValueChange={(id) => {
                            retrieveEvaluationAndSummaryStatistics(id);
                        }}
                    >
                        <SelectTrigger className="h-11 w-[300px] rounded-xl border-zinc-200 bg-white shadow-sm">
                            <SelectValue placeholder="Select evaluation" />
                        </SelectTrigger>

                        <SelectContent>
                            {evaluationList.map((evaluation) => (
                                <SelectItem
                                    key={evaluation.id}
                                    value={evaluation.id}
                                >
                                    {evaluation.id}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onClick={() => { setImprovePromptDialogOpen(true) }}>
                        Analyze & Improve Prompt
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {loading ? (
                        <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm md:col-span-4">
                            <CardContent className="p-8 text-center text-sm text-zinc-500">
                                Loading evaluation...
                            </CardContent>
                        </Card>
                    ) : summaryStatistics == null ? (
                        <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm md:col-span-4">
                            <CardContent className="p-8 text-center text-sm text-zinc-500">
                                Choose an evaluation to explore results and performance metrics.
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-500">
                                        Overall Score
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="text-4xl font-semibold tracking-tight text-zinc-950">
                                        {summaryStatistics.overallScore}%
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-500">
                                        Passed
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-emerald-50 p-2">
                                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                                        </div>

                                        <span className="text-4xl font-semibold tracking-tight text-zinc-950">
                                            {summaryStatistics.passed}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-500">
                                        Failed
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-red-50 p-2">
                                            <XCircle className="h-5 w-5 text-red-600" />
                                        </div>

                                        <span className="text-4xl font-semibold tracking-tight text-zinc-950">
                                            {summaryStatistics.failed}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-500">
                                        Avg Latency
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-orange-50 p-2">
                                            <Clock className="h-5 w-5 text-orange-600" />
                                        </div>

                                        <span className="text-4xl font-semibold tracking-tight text-zinc-950">
                                            {summaryStatistics.avgLatency}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>





                {evaluation.inputs.length > 0 && (
                    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

                        {/* Left Panel */}
                        <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle>Test Cases</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">
                                {evaluation.inputs.map((input, index) => {
                                    const score = evaluation.judgeScores[index] ?? 0;
                                    const passed = score >= 0.7;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedCase(index)}
                                            className={`w-full rounded-xl border p-4 text-left transition-all
                                                        ${selectedCase === index
                                                    ? "border-zinc-900 bg-zinc-100"
                                                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-zinc-900">
                                                    Test Case {index + 1}
                                                </span>

                                                <Badge
                                                    className={
                                                        passed
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-red-100 text-red-700"
                                                    }
                                                >
                                                    {passed ? "Passed" : "Failed"}
                                                </Badge>
                                            </div>

                                            <div className="mt-2 truncate text-sm text-zinc-500">
                                                {input}
                                            </div>

                                            <div className="mt-3 flex items-center gap-2">
                                                <Badge variant="outline">
                                                    {(score * 100).toFixed(0)}%
                                                </Badge>

                                                <span className="text-xs text-zinc-500">
                                                    {(
                                                        (evaluation.latencies[index] ?? 0) /
                                                        1000
                                                    ).toFixed(2)}
                                                    s
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Right Panel */}
                        <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle>
                                    Test Case {selectedCase + 1}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div>
                                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        Input
                                    </div>

                                    <div className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-800">
                                        {evaluation.inputs[selectedCase]}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        Expected Output
                                    </div>

                                    <div className="whitespace-pre-wrap rounded-xl bg-zinc-50 p-4 text-sm text-zinc-800">
                                        {evaluation.expectedOutputs[selectedCase]}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        Actual Output
                                    </div>

                                    <div className="whitespace-pre-wrap rounded-xl bg-zinc-50 p-4 text-sm text-zinc-800">
                                        {evaluation.outputs[selectedCase]}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                        Judge Reasoning
                                    </div>

                                    <div className="whitespace-pre-wrap rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
                                        {evaluation.judgeReasoning[selectedCase]}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}



                <div>

                    <Dialog
                        open={improvePromptDialogOpen}
                        onOpenChange={(open) => {
                            setImprovePromptDialogOpen(open);

                            if (!open) {
                                resetImprovePromptDialog();
                            }
                        }}
                    >
                        <DialogContent className="max-h-[90vh] overflow-hidden rounded-2xl border-zinc-200 p-0 shadow-xl sm:max-w-4xl">

                            {/* Header */}
                            <div className="border-b border-zinc-200 px-6 py-5">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-950">
                                        Prompt Analysis
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-zinc-500">
                                        Choose what you want the agent to analyze and improve.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>


                            <div className="max-h-[70vh] overflow-y-auto px-6">

                                {/* Check boxes for analysis options */}
                                {chooseOptions ? (
                                    <div className="grid gap-y-5 gap-x-2 pt-1 pb-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {[
                                            "Clarity",
                                            "Structure",
                                            "Edge Cases",
                                            "Output Format",
                                            "Hallucination Risk",
                                            "Evaluation Criteria",
                                        ].map((option) => (
                                            <label
                                                key={option}
                                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                                            >
                                                <Checkbox
                                                    checked={selectedAnalyses.includes(option)}
                                                    onCheckedChange={() => toggleAnalysis(option)}
                                                />
                                                {option}
                                            </label>
                                        ))}

                                        <Button 
                                            className="col-span-full mt-2 h-11 rounded-xl bg-zinc-950 font-medium text-white shadow-sm transition hover:bg-zinc-800"
                                            onClick={() => {
                                                setChooseOptions(false);
                                                setLoadingPromptImprovements(true);
                                                handleImprovePrompt(evaluation.id);
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                ) : loadingPromptImprovements ? (

                                    // Loading page while AI generates analysis
                                    <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
                                                <Loader2 className="h-5 w-5 animate-spin text-zinc-700" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-zinc-950">
                                                            Generating prompt improvements
                                                        </h3>
                                                        <p className="mt-1 text-sm leading-6 text-zinc-500">
                                                            Reviewing your selected criteria and generating a stronger prompt.
                                                        </p>
                                                    </div>

                                                    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-500 shadow-sm">
                                                        AI running
                                                    </span>
                                                </div>

                                                <div className="mt-5 space-y-2">
                                                    <div className="h-2 w-full animate-pulse rounded-full bg-zinc-100" />
                                                    <div className="h-2 w-5/6 animate-pulse rounded-full bg-zinc-100" />
                                                    <div className="h-2 w-2/3 animate-pulse rounded-full bg-zinc-100" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (

                                    // 
                                    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                                        <Card className="rounded-2xl border-amber-200 bg-amber-50/40">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <Lightbulb className="h-4 w-4 text-amber-600" />
                                                    Recommendation
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent>
                                                <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                                                    {recommendation || "Select analysis options and run the agent to generate recommendations."}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card className="rounded-2xl border-zinc-200 shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <Sparkles className="h-4 w-4 text-violet-600" />
                                                    Improved Prompt
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent>
                                                <ScrollArea className="h-[500px] rounded-xl border border-zinc-200 bg-zinc-50">
                                                    <div className="p-5">
                                                        <pre className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                                                            {improvedPrompt || "Your improved prompt will appear here."}
                                                        </pre>
                                                    </div>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>


                            <DialogFooter className="border-t border-zinc-200 bg-zinc-50 px-6 py-4" />
                        </DialogContent>

                    </Dialog>

                </div>
            </div>
        </main>
    );
}