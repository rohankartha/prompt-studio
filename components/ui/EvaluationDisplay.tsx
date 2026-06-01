"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/shdcn/card";

import { Badge } from "@/components/ui/shdcn/badge";

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

    const [evaluation, setEvaluation] = useState<Evaluation>({
        id: "",
        inputs: [],
        expectedOutputs: [],
        outputs: [],
        judgeScores: [],
        judgeReasoning: [],
        latencies: [],
    });

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





            </div>
        </main>
    );
}