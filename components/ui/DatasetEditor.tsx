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

import { ColumnDef } from "@tanstack/react-table";
import { EditableTable } from "./EditableTable";
import { Input } from "./shdcn/input";

import { useEffect, useState } from "react";

type DatasetRow = {
    input: string;
    expectedOutput: string;
    category: string;
};

type Dataset = {
    id: string;
    name: string;
    rows: DatasetRow[];
};

type DatasetName = {
    id: string;
    name: string;
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
    {
        accessorKey: "category",
        header: "Category",
    },
];

export function DatasetEditor() {
    const [newDatasetName, setNewDatasetName] = useState("");
    const [datasetNames, setDatasetNames] = useState<DatasetName[]>([]);

    const [addDatasetDialogOpen, setAddDatasetDialogOpen] =
        useState(false);

    const [openDatasetDialog, setOpenDatasetDialog] =
        useState(false);

    const [selectedDataset, setSelectedDataset] =
        useState<Dataset | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getDatasetNames() {
            const response = await fetch("/api/datasets");

            const data = await response.json();

            setDatasetNames(data);
            setLoading(false);
        }

        getDatasetNames();
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

        setDatasetNames((old) => [
            ...old,
            {
                id: dataset.id,
                name: dataset.name,
            },
        ]);

        setNewDatasetName("");
        setAddDatasetDialogOpen(false);
    }

    return (
        <main className="min-h-screen bg-muted/40 p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Datasets
                </h1>

                <Dialog
                    open={addDatasetDialogOpen}
                    onOpenChange={setAddDatasetDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Dataset
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                Create Dataset
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <Input
                                value={newDatasetName}
                                placeholder="Enter dataset name"
                                onChange={(e) =>
                                    setNewDatasetName(e.target.value)
                                }
                            />

                            <Button onClick={createNewDataset}>
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
                            Loading datasets...
                        </CardContent>
                    </Card>
                ) : datasetNames.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No datasets yet. Create one to get started.
                        </CardContent>
                    </Card>
                ) : (
                    datasetNames.map((datasetName) => (
                        <Card key={datasetName.id}>
                            <CardContent className="flex items-center justify-between p-4">
                                <h2 className="text-lg font-semibold">
                                    {datasetName.name}
                                </h2>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 border"
                                    onClick={() =>
                                        openDataset(datasetName.id)
                                    }
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    Open
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Dialog
                open={openDatasetDialog}
                onOpenChange={setOpenDatasetDialog}
            >
                <DialogContent className="flex h-[90vh] w-[98vw] max-w-none flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDataset?.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-auto">
                        {selectedDataset && (
                            <EditableTable
                                columns={columns}
                                data={selectedDataset?.rows ?? []}
                                datasetId={selectedDataset?.id ?? ""}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
}