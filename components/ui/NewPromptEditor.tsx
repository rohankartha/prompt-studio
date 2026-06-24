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
import { Textarea } from "@/components/ui/shdcn/textarea";
import { useState } from "react";
import { Save } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/shdcn/alert";
import { CircleX } from "lucide-react";
import { toast } from "sonner";


export function NewPromptEditor() {

    type Prompt = {
        name: string,
        content: string,
        version: number
    };


    // State variables
    const [prompt, setPrompt] = useState<Prompt>({
        name: "",
        content: "",
        version: 1
    });
    const [error, setError] = useState("");


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

        if (!response.ok) {
            toast.error(result?.error ?? "Failed to run evaluation.");
            return;
        }

        if (!result.ok) {
            setError(result.error);
        }
        setPrompt({
            name: "",
            content: "",
            version: 1
        })
    }


    return (

        <div className="space-y-6">
            <div className="grid gap-6 ">
                <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">

                    <CardHeader>
                        <CardTitle>Prompt Editor</CardTitle>
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

                        {/* Save prompt button */}
                        <div className="space-y-2">
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
                                onClick={savePrompt}
                            >
                                <Save className="h-4 w-4" />
                                Save Prompt
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}