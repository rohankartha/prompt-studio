"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";


export function PromptEditor() {

    // Variables to hold form data
    const [promptName, setPromptName] = useState("");
    const [promptBody, setPromptBody] = useState("");
    const [testInput, setTestInput] = useState("");
    const [model, setModel] = useState("");

    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log({
            promptName,
            promptBody,
            testInput,
            model,
        });
        console.log("submitted");

        setPromptName("");
        setPromptBody("");
        setTestInput("");
        setModel("");
    }






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

                    <Button variant="outline">
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
                                    value={promptBody}
                                    onChange={(e) => setPromptBody(e.target.value)}
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