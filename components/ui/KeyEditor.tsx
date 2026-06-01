"use client";

import {
    Card,
    CardContent,
} from "@/components/ui/shdcn/card";
import { Button } from "./shdcn/button";
import { FolderOpen, Plus } from "lucide-react";

import {
    Dialog,
    DialogTrigger,
    DialogHeader,
    DialogContent,
    DialogTitle,
} from "./shdcn/dialog";

import { Input } from "./shdcn/input";

import { useEffect, useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shdcn/select";

import { toast } from "sonner";


type Key = {
    id: string,
    provider: string
};


export function ApiKeyEditor() {

    const [newApiKeyName, setNewApiKeyName] = useState("");
    const [apiKeyNames, setApiKeyNames] = useState<Key[]>([]);
    const [addApiKeyDialogOpen, setAddApiKeyDialogOpen] = useState(false);

    const [openApiKeyDialog, setOpenApiKeyDialog] =
        useState(false);
    const [selectedApiKey, setSelectedApiKey] =
        useState<Key | null>(null);

    const [loading, setLoading] = useState(true);

    const [provider, setProvider] = useState("");

    const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);

    useEffect(() => {
        async function getApiKeyNames() {
            const response = await fetch("/api/keys");

            const data = await response.json();

            setApiKeyNames(data);
            setLoading(false);
        }

        getApiKeyNames();
    }, []);


    async function createNewApiKey() {
        const response = await fetch("/api/keys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newApiKeyName,
                provider
            }),
        });
        const body = await response.json();

        if (!response.ok) {
            toast.error(body?.error ?? "Failed to run evaluation.");
            return;
        }

        setApiKeyNames((old) => [
            ...old,
            {
                id: body.id,
                provider: body.provider,
            },
        ]);

        setNewApiKeyName("");
        setAddApiKeyDialogOpen(false);
    }




    async function replaceApiKey() {
        const response = await fetch("/api/keys", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: selectedApiKey?.id,
                provider: selectedApiKey?.provider
            }),
        });
        setSelectedApiKey(null);
    }


    async function deleteApiKey(keyId: string) {
        const response = await fetch(`/api/keys/${keyId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        setApiKeyNames((old) =>
            old.filter((key) => key.id !== keyId)
        );
        setSelectedApiKey(null);

    }




    return (
        <main className="min-h-screen bg-muted/40 p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    API Keys
                </h1>

                <Dialog
                    open={addApiKeyDialogOpen}
                    onOpenChange={setAddApiKeyDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add API Key
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                Add API Key
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <Input
                                value={newApiKeyName}
                                placeholder="Enter API key"
                                onChange={(e) =>
                                    setNewApiKeyName(e.target.value)
                                }
                            />

                            <Select
                                value={provider}
                                onValueChange={(provider) => setProvider(provider)}>

                                <SelectTrigger>
                                    <SelectValue placeholder="Choose API key provider" />
                                </SelectTrigger>



                                <SelectContent>

                                    <SelectItem
                                        key="openAI"
                                        value="Open AI"
                                    >
                                        Open AI
                                    </SelectItem>

                                    <SelectItem
                                        key="Anthropic"
                                        value="Anthropic"
                                    >
                                        Anthropic
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button onClick={createNewApiKey}>
                                Submit
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>




            <div className="grid gap-4">
                {loading ? (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            Loading API Keys...
                        </CardContent>
                    </Card>
                ) : apiKeyNames.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No API keys yet.
                        </CardContent>
                    </Card>
                ) : (
                    apiKeyNames.map((apiKeyName) => (
                        <Card key={apiKeyName.id}>
                            <CardContent className="flex items-center justify-between p-4">
                                <h2 className="text-lg font-semibold">
                                    {apiKeyName.provider}
                                </h2>

                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setSelectedApiKey({
                                                id: apiKeyName.id,
                                                provider: apiKeyName.provider,
                                            });
                                            setReplaceDialogOpen(true);
                                        }}
                                    >
                                        Replace
                                    </Button>

                                    <Button 
                                        variant="ghost"
                                        onClick={() => {
                                            setSelectedApiKey({
                                                id: apiKeyName.id,
                                                provider: apiKeyName.provider,
                                            });
                                            deleteApiKey(apiKeyName.id)
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>


                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Dialog
                open={replaceDialogOpen}
                onOpenChange={setReplaceDialogOpen}
            >
                <DialogContent className="flex w-[50vw] flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedApiKey?.provider}


                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            value={newApiKeyName}
                            placeholder="Enter New API key"
                            onChange={(e) =>
                                setNewApiKeyName(e.target.value)
                            }
                        />
                        <Button onClick={replaceApiKey}>
                            Submit
                        </Button>

                    </div>


                </DialogContent>
            </Dialog>
        </main>
    );
}