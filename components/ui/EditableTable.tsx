"use client"

import { useState } from "react"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./shdcn/table"

import { Button } from "./shdcn/button"
import { Save } from "lucide-react";
import { toast } from "sonner"

type EditableTableProps<
    TData extends Record<string, string>,
    TValue
> = {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    datasetId: string
}

type EditingCell = {
    row: number
    column: string
} | null

export function EditableTable<
    TData extends Record<string, string>,
    TValue
>({
    columns,
    data,
    datasetId
}: EditableTableProps<TData, TValue>) {

    const [tableData, setTableData] = useState<TData[]>(data)
    const [editingCell, setEditingCell] = useState<EditingCell>(null)

    function updateCell(
        rowIndex: number,
        columnId: string,
        value: string
    ) {
        setTableData((oldData) => {
            const newData = [...oldData]

            newData[rowIndex] = {
                ...newData[rowIndex],
                [columnId]: value,
            }

            return newData
        })
    }

    function addRow() {
        const emptyRow: Record<string, string> = {}

        columns.forEach((column) => {
            if (
                "accessorKey" in column &&
                typeof column.accessorKey === "string"
            ) {
                emptyRow[column.accessorKey] = ""
            }
        })

        setTableData((oldData) => [
            ...oldData,
            emptyRow as TData,
        ])
    };

    function deleteRow(rowIndex: number) {
        setTableData((oldData) =>
            oldData.filter(
                (_, index) => index !== rowIndex
            )
        )
    };

    async function saveTable() {

        const payload = {
            datasetId,
            tableData
        }

        const response = await fetch("/api/datasets", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) {
            toast.error(result?.error ?? "Demo accounts cannot perform this action.");
            return;
        }
    };

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
    <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border bg-white px-5 py-4 shadow-sm">
            <div>
                <h3 className="text-base font-semibold text-zinc-950">
                    Dataset Editor
                </h3>
                <p className="text-sm text-zinc-500">
                    Click any cell to edit. Add rows as needed, then save changes.
                </p>
            </div>

            <Button
                onClick={saveTable}
                className="gap-2 rounded-xl bg-zinc-950 px-4 shadow-sm hover:bg-zinc-800"
            >
                <Save className="h-4 w-4" />
                Save Changes
            </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b bg-zinc-50/80 px-5 py-3">
                <p className="text-sm font-medium text-zinc-700">
                    {tableData.length} rows
                </p>

                <button
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-950"
                    onClick={addRow}
                >
                    Add Row
                </button>
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="border-b bg-zinc-50/60 hover:bg-zinc-50/60"
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}

                            <TableHead className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                Actions
                            </TableHead>
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="transition hover:bg-zinc-50/70"
                            >
                                {row.getVisibleCells().map((cell) => {
                                    const isEditing =
                                        editingCell?.row === row.index &&
                                        editingCell?.column === cell.column.id;

                                    return (
                                        <TableCell
                                            key={cell.id}
                                            className="px-5 py-3 align-top"
                                        >
                                            {isEditing ? (
                                                <input
                                                    autoFocus
                                                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                                                    value={String(cell.getValue() ?? "")}
                                                    onChange={(e) =>
                                                        updateCell(
                                                            row.index,
                                                            cell.column.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={() => setEditingCell(null)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            setEditingCell(null);
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="min-h-10 cursor-pointer rounded-xl px-3 py-2 text-sm text-zinc-800 transition hover:bg-zinc-100"
                                                    onClick={() =>
                                                        setEditingCell({
                                                            row: row.index,
                                                            column: cell.column.id,
                                                        })
                                                    }
                                                >
                                                    {String(cell.getValue() ?? "") || (
                                                        <span className="text-zinc-400">
                                                            Empty
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
                                    );
                                })}

                                <TableCell className="px-5 py-3 text-right align-top">
                                    <button
                                        className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                        onClick={() => deleteRow(row.index)}
                                    >
                                        Delete
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + 1}
                                className="h-40 text-center"
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <p className="text-sm font-medium text-zinc-700">
                                        No rows yet
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        Add your first row to start building this dataset.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </div>
);
}