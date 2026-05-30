"use client";


// Dependencies
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
import { ColumnDef } from "@tanstack/react-table";
import { EditableTable } from "./EditableTable";
import { Input } from "./shdcn/input";
import { useEffect, useState } from "react";


type DatasetRow = {
    input: string;
    expectedOutput: string;
};

type Dataset = {
    id: string;
    name: string;
    rows: DatasetRow[];
};

type DatasetMetadata = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    numberOfEntries: number
};


const columns: ColumnDef<DatasetRow>[] = [
    {
        accessorKey: "input",
        header: "Input",
    },
    {
        accessorKey: "expectedOutput",
        header: "Expected Output",
    },
];

export function DatasetEditor() {
    const [newDatasetName, setNewDatasetName] = useState("");




    const [datasetMetadata, setDatasetMetadata] = useState<DatasetMetadata[]>([]);

    // State variables for open dialogs
    const [addDatasetDialogOpen, setAddDatasetDialogOpen] = useState(false);
    const [openDatasetDialog, setOpenDatasetDialog] = useState(false);

    const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function getDatasetMetadata() {
            const response = await fetch("/api/datasets");
            const data = await response.json();

            setDatasetMetadata(data);
            setLoading(false);
        }
        getDatasetMetadata();
    }, []);


    async function openDataset(datasetId: string) {
        const response = await fetch(`/api/datasets/${datasetId}`);
        const dataset = await response.json();

        setSelectedDataset(dataset);
        setOpenDatasetDialog(true);
    }


    async function createNewDataset() {
        const response = await fetch("/api/datasets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newDatasetName,
            }),
        });

        const body = await response.json();
        const dataset = body.dataset;

        setDatasetMetadata((old) => [
            ...old,
            {
                id: dataset.id,
                name: dataset.name,
                createdAt: dataset.createdAt,
                updatedAt: dataset.updatedAt,
                numberOfEntries: dataset.numberOfEntries
            },
        ]);

        setNewDatasetName("");
        setAddDatasetDialogOpen(false);
    }


    return (
        <main className="min-h-screen bg-zinc-50 px-8 py-10">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-start justify-between">
                    <div>
                        
                        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-zinc-950">
                            Datasets
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-zinc-500">
                            Create, manage, and edit evaluation datasets for prompt testing.
                        </p>
                    </div>

                    <Dialog open={addDatasetDialogOpen} onOpenChange={setAddDatasetDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 rounded-xl bg-zinc-950 shadow-sm hover:bg-zinc-800">
                                <Plus className="h-4 w-4" />
                                New Dataset
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="rounded-2xl sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Create dataset</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 pt-2">
                                <Input
                                    value={newDatasetName}
                                    placeholder="e.g. Customer Support Eval"
                                    onChange={(e) => setNewDatasetName(e.target.value)}
                                    className="rounded-xl"
                                />

                                <Button
                                    onClick={createNewDataset}
                                    className="w-full rounded-xl bg-zinc-950 hover:bg-zinc-800"
                                >
                                    Create Dataset
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <Card className="rounded-2xl border-dashed bg-white shadow-sm">
                            <CardContent className="p-8 text-center text-sm text-zinc-500">
                                Loading datasets...
                            </CardContent>
                        </Card>
                    ) : datasetMetadata.length === 0 ? (
                        <Card className="col-span-full rounded-2xl border-dashed bg-white shadow-sm">
                            <CardContent className="flex min-h-[240px] flex-col items-center justify-center p-8 text-center">
                                <div className="mb-4 rounded-2xl bg-zinc-100 p-4">
                                    <FolderOpen className="h-7 w-7 text-zinc-500" />
                                </div>
                                <h2 className="text-lg font-semibold text-zinc-950">
                                    No datasets yet
                                </h2>
                                <p className="mt-2 max-w-sm text-sm text-zinc-500">
                                    Create your first dataset to start evaluating prompt outputs.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        datasetMetadata.map((dataset) => (
                            <Card
                                key={dataset.id}
                                className="group rounded-2xl border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <CardContent className="space-y-5 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="line-clamp-1 text-lg font-semibold text-zinc-950">
                                                {dataset.name}
                                            </h2>
                                            <p className="mt-1 text-sm text-zinc-500">
                                                {dataset.numberOfEntries} entries
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t pt-4">
                                        <p className="text-xs text-zinc-400">
                                            Updated recently
                                        </p>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50"
                                            onClick={() => openDataset(dataset.id)}
                                        >
                                            Open
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <Dialog open={openDatasetDialog} onOpenChange={setOpenDatasetDialog}>
                    <DialogContent className="flex h-[92vh] w-[96vw] max-w-none flex-col overflow-hidden rounded-2xl p-0">
                        <DialogHeader className="border-b px-6 py-4">
                            <DialogTitle className="text-xl font-semibold">
                                {selectedDataset?.name}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex-1 overflow-auto bg-zinc-50 p-6">
                            <div className="rounded-2xl border bg-white p-4 shadow-sm">
                                {selectedDataset && (
                                    <EditableTable
                                        columns={columns}
                                        data={selectedDataset.rows ?? []}
                                        datasetId={selectedDataset.id ?? ""}
                                    />
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    );
}