"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/shdcn/card";
import { Button } from "./shdcn/button";
import { FolderOpen } from "lucide-react";

import {
    Dialog,
    DialogTrigger,
    DialogHeader,
    DialogContent,
    DialogTitle
} from "./shdcn/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./shdcn/table";

export function DatasetEditor() {
    return (
        <main className="min-h-screen bg-muted/40 p-8">


            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Datasets
                    </h1>
                </div>
            </div>

            <div className="grid gap-4">


                <Card>
                    <CardContent className="flex items-center justify-between p-4">
                        <div>
                            <h2 className="font-semibold text-lg">
                                Billing Support Eval
                            </h2>

                            <p className="text-muted-foreground text-sm">
                                10 test cases
                            </p>
                        </div>




                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost"
                                    size="sm"
                                    className="gap-2 border border-border"
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    Open
                                </Button>

                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
    <DialogHeader>
        <DialogTitle>Billing Support Eval</DialogTitle>
    </DialogHeader>

    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Input</TableHead>
                <TableHead>Expected Output</TableHead>
                <TableHead>Category</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
            <TableRow>
                <TableCell>How do I update my billing info?</TableCell>
                <TableCell>Provide billing settings instructions</TableCell>
                <TableCell>Billing</TableCell>
            </TableRow>

            <TableRow>
                <TableCell>Why was I charged twice?</TableCell>
                <TableCell>Explain duplicate charge resolution</TableCell>
                <TableCell>Billing</TableCell>
            </TableRow>
        </TableBody>
    </Table>
</DialogContent>
                        </Dialog>
















                    </CardContent>
                </Card>



            </div>

        </main>
    );
}