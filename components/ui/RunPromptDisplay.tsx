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
import { useEffect } from "react";
import { Play, Save } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/shdcn/alert";
import { CircleX } from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./shdcn/table";
import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/shdcn/tabs";



type OutputRow = {
    input: string;
    expectedOutput: string;
    actualOutput: string
};

const columns: { key: keyof OutputRow; label: string }[] = [
    { key: "input", label: "Input" },
    { key: "expectedOutput", label: "Expected Output" },
    { key: "actualOutput", label: "Actual Output" },
];



type OutputCardProps = {
    output: OutputRow[]
}


function OutputCard({ output }: OutputCardProps) {


    return (
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
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/40 hover:bg-muted/40">
                                {columns.map((column) => (
                                    <TableHead
                                        key={column.key}
                                        className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                    >
                                        {column.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {output.map((row, index) => (
                                <TableRow
                                    key={index}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    {columns.map((column) => {
                                        const value = row[column.key];

                                        return (
                                            <TableCell
                                                key={`${column.key}-${index}`}
                                                className="max-w-[320px] px-5 py-4 align-top text-sm"
                                            >
                                                <div className="max-h-32 overflow-y-auto">
                                                    {value}

                                                </div>

                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>




                )}

            </CardContent>
        </Card>
    );
}




type RunPromptCardProps = {
    setOutput: React.Dispatch<React.SetStateAction<OutputRow[]>>;
};


function RunPromptCard({ setOutput }: RunPromptCardProps) {
    type Prompt = {
        id: string,
        name: string,
        content: string,
        version: number
    };
    type DatasetListItem = {
        id: string;
        name: string;
    }
    type PromptListItem = {
        id: string,
        name: string,
        version: number
    };



    // State variables
    const [datasetList, setDatasetList] = useState<DatasetListItem[]>([]);
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


    // Function to execute prompt
    async function runPrompt() {

        const payload = {
            prompt,
            model: model,
            datasetId: selectedDatasetId
        }

        const response = await fetch("/api/run", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
            toast.error(data?.error ?? "Failed to run evaluation.");
            return;
        }
        // console.log(data)
        setOutput(data);

        // console.log(output)

        setModel("");
        setSelectedDatasetId("");
    }


    return (

        <div className="space-y-6">
            <div className="grid gap-6">
                <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm">

                    <CardHeader>
                        <CardTitle>Run Prompt</CardTitle>
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

                                    placeholder="You are a helpful customer support agent..."
                                    value={prompt.content}
                                    // onChange={(e) =>
                                    //     setPrompt((prev) => ({
                                    //         ...prev,
                                    //         content: e.target.value,
                                    //     }))
                                    // }
                                    readOnly
                                />
                            </div>
                        )}


                        {/* Choose test dataset */}
                        {prompt.name && prompt.version != 0 && (
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
                        )}

                        {/* Choose model input */}
                        {prompt.name && prompt.version != 0 && (
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
                        )}

                        {/* Save prompt button */}
                        <div className="space-y-2">

                            {/* Run prompt button */}
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
                                disabled={!prompt.name && !prompt.content && !model && !selectedDatasetId}
                                onClick={runPrompt}
                            >
                                Run Prompt
                                <Play className="h-4 w-4" />
                            </Button>
                        </div>

                    </CardContent>

                </Card>




            </div>
        </div>
    );

}











export function RunPromptDisplay() {
    const [output, setOutput] = useState<OutputRow[]>([]);

    return (
        <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompt">
                    Run Prompt
                </TabsTrigger>
                <TabsTrigger value="output">
                    Output
                </TabsTrigger>
            </TabsList>

            <TabsContent value="prompt" className="mt-4">
                <RunPromptCard setOutput={setOutput} />
            </TabsContent>

            <TabsContent value="output" className="mt-4">
                <OutputCard output={output} />
            </TabsContent>
        </Tabs>
    );
};
