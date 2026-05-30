"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./shdcn/table";
import { X, Check, FlaskConical } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/shdcn/dialog";
import { Button } from "@/components/ui/shdcn/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shdcn/select";
import { Label } from "@/components/ui/shdcn/label";
import { toast } from "sonner";


export type RunTableRow = {
    id: string;
    promptName: string;
    datasetName: string;
    latencyMs: number;
    tokensIn: number;
    tokensOut: number;
};

// model Run {
//     id String @id @default(cuid())

//     promptId String
//     prompt   Prompt @relation(fields: [promptId], references: [id])

//     datasetId String
//     dataset   Dataset @relation(fields: [datasetId], references: [id])

//     evaluations Evaluation[]
//     output      String[]
//     latencyMs   Float
//     tokensIn    Int
//     tokensOut   Int
// }


export default function PromptRunResultsTable() {


    // State variables associated with selecting a row
    const [selectedRun, setSelectedRun] = useState<RunTableRow | null>(null);
    const [evalDialogOpen, setEvalDialogOpen] = useState(false);

    // State variables storing evaluation configurations
    const [judgeModel, setJudgeModel] = useState("");
    const [judgeType, setJudgeType] = useState("");


    // Function to update state variables when row is clicked
    function handleRowClick(
        run: RunTableRow,
        promptId: string,
        datasetId: string
    ) {

        setSelectedRun(run);
        setEvalDialogOpen(true);
    };


    const [runResults, setRunResults] = useState<RunTableRow[]>([]);


    // Hook retrieves all runs when page is loaded
    useEffect(() => {
        async function retrieveRuns() {

            const response = await fetch("/api/run-results", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json()
            setRunResults(result);
        }
        retrieveRuns();

    }, [])


    async function runEvaluation(run: RunTableRow) {

        if (!judgeModel) {
            toast.error("Please select a judge model.");
            return;
        }

        if (!judgeType) {
            toast.error("Please select a judge type.");
            return;
        }

        const payload = {
            runId: run.id,
            datasetId: run.datasetId,
            judgeModel: judgeModel,
            judgeType: judgeType
        }

        const response = await fetch("/api/evaluations/run", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
            toast.error(result?.error ?? "Failed to run evaluation.");
            return;
        }
    }



    if (runResults.length === 0) {
        return (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 p-8 text-center">
                <div className="mb-4 rounded-full bg-background p-3 shadow-sm">
                    <FlaskConical className="h-6 w-6 text-muted-foreground" />
                </div>

                <h3 className="text-sm font-semibold">No run results yet</h3>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Run a prompt against a dataset to see latency, token usage, outputs,
                    and evaluation results here.
                </p>
            </div>
        );
    }

    const columns = Object.keys(runResults[0]) as (keyof RunTableRow)[];

    return (
        <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
            {/* <div className="border-b bg-muted/30 px-5 py-4">
                <h2 className="text-lg font-semibold">Prompt Run Results</h2>
            </div> */}

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            {columns.map((column) => (
                                <TableHead
                                    key={String(column)}
                                    className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                >
                                    {formatColumnName(String(column))}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {runResults.map((run) => (
                            <TableRow
                                key={run.id}
                                onClick={() => handleRowClick(run)}
                                className="transition-colors hover:bg-muted/30"
                            >
                                {columns.map((column) => {
                                    const value = run[column];

                                    return (
                                        <TableCell
                                            key={String(column)}
                                            className="max-w-[320px] px-5 py-4 align-top text-sm"
                                        >
                                            <CellValue value={value} />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>










                <Dialog
                    open={evalDialogOpen}
                    onOpenChange={setEvalDialogOpen}
                >
                    <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-lg rounded-2xl border-zinc-200 p-0 shadow-xl">
                        <div className="border-b border-zinc-200 px-6 py-5">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-950">
                                    Run Evaluation
                                </DialogTitle>

                                <p className="text-sm text-zinc-500">
                                    Choose a judge configuration to evaluate this prompt run.
                                </p>
                            </DialogHeader>
                        </div>

                        <div className="space-y-5 px-6 py-5">
                            {selectedRun && (
                                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm font-medium text-zinc-700">
                                            Selected Run
                                        </span>

                                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-zinc-500 shadow-sm">
                                            Ready
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-zinc-500">Run ID</span>
                                            <span className="max-w-[260px] truncate font-mono text-xs text-zinc-800">
                                                {selectedRun.id}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-zinc-500">Prompt</span>
                                            <span className="max-w-[260px] truncate font-medium text-zinc-900">
                                                {selectedRun.promptName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-700">
                                    Judge Model
                                </Label>

                                <Select
                                    value={judgeModel}
                                    onValueChange={(model) => setJudgeModel(model)}
                                >
                                    <SelectTrigger className="h-11 rounded-xl border-zinc-200 bg-white shadow-sm">
                                        <SelectValue placeholder="Choose model" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="gpt-4o-mini">
                                            GPT-4o Mini
                                        </SelectItem>
                                        <SelectItem value="gpt-4o">
                                            GPT-4o
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <p className="text-xs text-zinc-500">
                                    Used when the judge type requires model-based evaluation.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-zinc-700">
                                    Judge Type
                                </Label>

                                <Select
                                    value={judgeType}
                                    onValueChange={(type) => setJudgeType(type)}
                                >
                                    <SelectTrigger className="h-11 rounded-xl border-zinc-200 bg-white shadow-sm">
                                        <SelectValue placeholder="Choose judge type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="EXACT_MATCH">
                                            Exact Match
                                        </SelectItem>
                                        <SelectItem value="LLM">
                                            LLM Judge
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <p className="text-xs text-zinc-500">
                                    Exact Match compares expected and actual outputs. LLM Judge uses a model to score quality.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="border-t border-zinc-200 bg-zinc-50 px-6 py-4">
                            <Button
                                variant="outline"
                                className="rounded-xl bg-white shadow-sm hover:bg-zinc-50"
                                onClick={() => setEvalDialogOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="rounded-xl bg-zinc-950 px-5 text-white shadow-sm hover:bg-zinc-800"
                                onClick={() => {
                                    if (!selectedRun) return;
                                    runEvaluation(selectedRun);
                                    setEvalDialogOpen(false);
                                }}
                            >
                                Run Evaluation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>










            </div>
        </div>
    );
}






function CellValue({ value }: { value: unknown }) {
    if (typeof value === "boolean") {
        return value ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                Complete
            </span>
        ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                <X className="h-3.5 w-3.5" />
                Incomplete
            </span>
        );
    }

    if (Array.isArray(value)) {
        return (
            <div className="flex max-w-[320px] flex-col gap-1.5">
                {value.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-md border bg-muted/30 px-2.5 py-1.5 text-xs text-muted-foreground"
                    >
                        {String(item)}
                    </div>
                ))}
            </div>
        );
    }

    if (value === null || value === undefined || value === "") {
        return <span className="text-muted-foreground">—</span>;
    }

    if (typeof value === "number") {
        return (
            <span className="font-medium tabular-nums">
                {formatNumber(value)}
            </span>
        );
    }

    return (
        <span className="line-clamp-3 text-foreground">
            {String(value)}
        </span>
    );
}

function formatColumnName(column: string) {
    return column
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
}

function formatNumber(value: number) {
    if (Number.isInteger(value)) return value.toLocaleString();

    return value.toLocaleString(undefined, {
        maximumFractionDigits: 2,
    });
}