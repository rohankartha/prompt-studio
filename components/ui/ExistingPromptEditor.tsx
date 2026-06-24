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
import { toast } from "sonner";



export function ExistingPromptEditor() {

    type Prompt = {
        id: string,
        name: string,
        content: string,
        version: number
    };

    type PromptListItem = {
        id: string,
        name: string,
        version: number
    };


    // State variables
    const [selectedDatasetId, setSelectedDatasetId] = useState("");
    const [prompt, setPrompt] = useState<Prompt>({
        id: "",
        name: "",
        content: "",
        version: 0
    });
    const [promptList, setPromptList] = useState<PromptListItem[]>([]);
    const [model, setModel] = useState("");
    const [error, setError] = useState("");


    // Hook to populate dataset dropdown
    useEffect(() => {

        async function getPromptList() {
        
            const response = await fetch("/api/prompts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            console.log(data)
            setPromptList(data);
        }
        getPromptList();
    }, [])


    async function retrievePrompt(promptId: string) {

        const response = await fetch(`/api/prompts/${promptId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        
        setPrompt((prev) => ({
            ...prev,
            content: data.content,
        }))

    }


    // Function to save prompt in database
    async function savePrompt() {

        const response = await fetch("/api/prompts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prompt)
        });

        const result = await response.json();

        if (!response.ok) {
            toast.error(result?.error ?? "Failed to run evaluation.");
            return;
        }

        if (!result.ok) {
            setError(result.error);
        }
        setPrompt({
            id: "",
            name: "",
            content: "",
            version: 0
        })
    }


    return (
        
        <div className="space-y-6">
            <div className="grid gap-6">
                <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">

                    <CardHeader>
                        <CardTitle>Prompt Editor</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">

                        {/* Prompt name input */}
                        <div className="space-y-2">
                            <Label>Prompt Name</Label>
                            <Select
                                value={prompt.name}
                                onValueChange={(name) => setPrompt((prev) => ({
                                    ...prev,
                                    name: name
                                }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose prompt name" />
                                </SelectTrigger>

                                <SelectContent>
                                    {promptList.map((prompt) => (
                                        <SelectItem
                                            key={prompt.id}
                                            value={prompt.name}
                                        >
                                            {prompt.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>


                        {/* Prompt version input */}
                        {prompt.name && (
                            <div className="space-y-2">
                                <Label>Prompt Version</Label>
                                <Select
                                    value={prompt.id}
                                    onValueChange={(id) => {
                                        const selectedPrompt = promptList.find((p) => p.id === id);
                                        if (!selectedPrompt) return;
                                        setPrompt((prev) => ({
                                            ...prev,
                                            id: selectedPrompt.id,
                                            version: selectedPrompt.version,
                                        }));
                                        retrievePrompt(id);
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose prompt version" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {promptList
                                            .filter((p) => p.name === prompt.name)
                                            .sort((a, b) => a.version - b.version)
                                            .map((p) => (
                                                <SelectItem
                                                    key={p.id}
                                                    value={p.id}
                                                >
                                                    v{p.version}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        )}


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
                        {prompt.name && prompt.version != 0 && (
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
                        )}

                        {/* Save prompt button */}
                        <div className="space-y-2">
                            <Button
                                variant="outline"
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
                                disabled={!prompt.name && !prompt.content}
                                onClick={savePrompt}
                            >
                                Save Prompt
                                <Save className="h-4 w-4" />
                            </Button>
                        </div>

                    </CardContent>

                </Card>

 
            </div>
        </div>
    );
}