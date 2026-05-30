"use client";


// Dependencies
import { Button } from "@/components/ui/shdcn/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/shdcn/card";
import { Input } from "@/components/ui/shdcn/input";
import { Label } from "@/components/ui/shdcn/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shdcn/select";
import { useState } from "react";
import { useEffect } from "react";
import { Play, Save } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/shdcn/alert";
import { CircleX } from "lucide-react";



export function NewPromptEditor() {

    type Prompt = {
        name: string,
        content: string,
        version: number
    };
    type DatasetListItem = {
        id: string;
        name: string;
    }
    type OutputRow = {
        input: string;
        expectedOutput?: string;
        actualOutput?: string
    };


    // State variables
    const [datasetList, setDatasetList] = useState<DatasetListItem[]>([]);
    const [selectedDatasetId, setSelectedDatasetId] = useState("");
    const [prompt, setPrompt] = useState<Prompt>({
        name: "",
        content: "",
        version: 1
    });
    const [model, setModel] = useState("");
    const [error, setError] = useState("");
    const [output, setOutput] = useState<OutputRow[]>([]);


    // Function to save prompt in database
    async function savePrompt() {

        const response = await fetch("/api/prompts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prompt)
        });

        const result = await response.json()

        if (!result.ok) {
            setError(result.error);
        }
        setPrompt({
            name: "",
            content: "",
            version: 1
        })
    }


    // Function to execute prompt
    async function runPrompt() {

        const payload = {
            prompt,
            model: model,
            datasetId: selectedDatasetId
        }

        const response = await fetch("/api/run-prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        setOutput(data);

        setModel("");
        setSelectedDatasetId("");
    }


    // Hook to populate dataset dropdown
    useEffect(() => {

        async function getDatasetList() {

            const response = await fetch("/api/datasets", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const datasets = await response.json();
            setDatasetList(datasets);
        }
        getDatasetList();
    }, [])


    return (
        
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">

                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">

                        {/* Prompt name input */}
                        <div className="space-y-2">
                            <Label>Prompt Name</Label>
                            <Input
                                placeholder="e.g. Customer Support Assistant"
                                value={prompt.name}
                                onChange={(e) =>
                                    setPrompt((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <Alert variant="destructive">
                                <CircleX className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* System prompt input */}
                        <div className="space-y-2">
                            <Label>Prompt Content</Label>
                            <Textarea
                                className="min-h-48 resize-none"
                                placeholder="You are a helpful customer support agent..."
                                value={prompt.content}
                                onChange={(e) =>
                                    setPrompt((prev) => ({
                                        ...prev,
                                        content: e.target.value,
                                    }))
                                }
                            />
                        </div>


                        {/* Choose test dataset */}
                        <div className="space-y-2">
                            <Label>Dataset</Label>
                            <Select
                                value={selectedDatasetId}
                                onValueChange={(id) => setSelectedDatasetId(id)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose dataset" />
                                </SelectTrigger>

                                <SelectContent>
                                    {datasetList.map((dataset) => (
                                        <SelectItem
                                            key={dataset.id}
                                            value={dataset.id}
                                        >
                                            {dataset.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Choose model input */}
                        <div className="space-y-2">
                            <Label>Model</Label>
                            <Select
                                value={model}
                                onValueChange={(model) => setModel(model)}>
                                <SelectTrigger>
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
                        </div>

                        {/* Run prompt button */}
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="
                                        w-full
                                        rounded-xl
                                        border-zinc-200
                                        bg-white
                                        shadow-sm
                                        transition-all
                                        hover:bg-zinc-50
                                        hover:shadow
                                    "
                                onClick={savePrompt}
                            >
                                Save Prompt
                                <Save className="h-4 w-4" />
                            </Button>

                            <Button
                                className="
                                        w-full
                                        rounded-xl
                                        bg-zinc-950
                                        text-white
                                        shadow-sm
                                        transition-all

                                        hover:bg-zinc-800
                                        hover:shadow-md

                                        active:scale-[0.99]
                                    "
                                onClick={runPrompt}
                            >
                                Run Prompt
                                <Play className="h-4 w-4" />
                            </Button>
                        </div>

                    </CardContent>

                </Card>

                <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>Output</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {output.length === 0 ? (
                            <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
                                Run a prompt to see the model response here.
                            </div>
                        ) : (


                            <div className="space-y-4">
                                {output.map((row, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border p-4"
                                    >
                                        <div className="mb-2">
                                            <span className="font-semibold">
                                                Input:
                                            </span>
                                            <p>{row.input}</p>
                                        </div>

                                        <div className="mb-2">
                                            <span className="font-semibold">
                                                Expected:
                                            </span>
                                            <p>{row.expectedOutput}</p>
                                        </div>

                                        <div>
                                            <span className="font-semibold">
                                                Actual:
                                            </span>
                                            <p>{row.actualOutput}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}