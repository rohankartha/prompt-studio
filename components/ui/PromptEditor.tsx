"use client";

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


export function PromptEditor() {

    // Variables to hold form data
    const [promptName, setPromptName] = useState("");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [testInput, setTestInput] = useState("");
    const [model, setModel] = useState("");
    const [testDataset, setTestDataset] = useState("");




    type Dataset = {
        id: string,
        name: string
    }





    const [datasets, setDatasets] = useState<Dataset[]>([]);



    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    async function savePrompt() {

        const payload = {
            promptName,
            systemPrompt,
            testInput,
            model
        }

        await fetch("/api/prompts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        setPromptName("");
        setSystemPrompt("");
        setTestInput("");
        setModel("");
    }



    function runPrompt() {
        
    }









    useEffect(() => {

        async function getDatasetNames() {

            const response = await fetch("/api/datasets", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const datasets = await response.json();


            console.log(datasets);
            setDatasets(datasets);
        }
        getDatasetNames();

    }, [])









    return (
        <main className="min-h-screen bg-muted/40 p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Prompts / New Prompt
                        </p>
                        <h1 className="text-3xl font-bold">
                            Prompt Editor
                        </h1>
                    </div>

                    <Button
                        variant="outline"
                        onClick={savePrompt}>
                        Save Prompt
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <Card>



                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                        </CardHeader>

                        <form onSubmit={handleSubmit}>

                            <CardContent className="space-y-5">

                                {/* Prompt name input */}
                                <div className="space-y-2">
                                    <Label>Prompt name</Label>
                                    <Input
                                        placeholder="e.g. Customer Support Assistant"
                                        value={promptName}
                                        onChange={(e) => setPromptName(e.target.value)}
                                    />
                                </div>


                                {/* System prompt input */}
                                <div className="space-y-2">
                                    <Label>System prompt</Label>
                                    <Textarea
                                        className="min-h-48 resize-none"
                                        placeholder="You are a helpful customer support agent..."
                                        value={systemPrompt}
                                        onChange={(e) => setSystemPrompt(e.target.value)}
                                    />
                                </div>

                                {/* Test input */}
                                <div className="space-y-2">
                                    <Label>Test input</Label>
                                    <Textarea
                                        className="min-h-32 resize-none"
                                        placeholder="I was charged twice this month."
                                        value={testInput}
                                        onChange={(e) => setTestInput(e.target.value)}
                                    />
                                </div>




                                {/* Choose test dataset */}
                                <div className="space-y-2">
                                    <Label>Test dataset</Label>
                                    <Select
                                        value={testDataset}
                                        onValueChange={(dataset) => setTestDataset(dataset)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose test dataset" />
                                        </SelectTrigger>



                                        <SelectContent>
                                            {datasets.map((dataset) => (
                                                <SelectItem
                                                    key={dataset.id}
                                                    value={dataset.name}
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
                                            <SelectValue placeholder="Choose a model" />
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
                                <Button className="w-full">
                                    Run Prompt
                                </Button>


                            </CardContent>
                        </form>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Output</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
                                Run a prompt to see the model response here.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}