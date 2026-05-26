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

        await fetch("/api/datasets", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
    };

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>

            {/* Save button */}
            <div className="flex justify-end mb-2">
                <Button className="gap-2" onClick={saveTable}>
                    <Save className="h-4 w-4" />
                    Save
                </Button>
            </div>





            <div className="overflow-hidden rounded-md border">
                <div className="flex justify-end border-b p-2">
                    <button
                        className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
                        onClick={addRow}
                    >
                        Add Row
                    </button>
                </div>

                <Table>
                    <TableHeader>
                        {table
                            .getHeaderGroups()
                            .map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                >
                                    {headerGroup.headers.map(
                                        (header) => (
                                            <TableHead
                                                key={header.id}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header
                                                            .column
                                                            .columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    )}

                                    <TableHead>
                                        Actions
                                    </TableHead>
                                </TableRow>
                            ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows
                            ?.length ? (
                            table
                                .getRowModel()
                                .rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() &&
                                            "selected"
                                        }
                                    >
                                        {row
                                            .getVisibleCells()
                                            .map((cell) => {
                                                const isEditing =
                                                    editingCell?.row ===
                                                    row.index &&
                                                    editingCell?.column ===
                                                    cell
                                                        .column
                                                        .id

                                                return (
                                                    <TableCell
                                                        key={
                                                            cell.id
                                                        }
                                                    >
                                                        {isEditing ? (
                                                            <input
                                                                autoFocus
                                                                className="w-full rounded border px-2 py-1"
                                                                value={String(
                                                                    cell.getValue() ??
                                                                    ""
                                                                )}
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    updateCell(
                                                                        row.index,
                                                                        cell
                                                                            .column
                                                                            .id,
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                onBlur={() =>
                                                                    setEditingCell(
                                                                        null
                                                                    )
                                                                }
                                                                onKeyDown={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e.key ===
                                                                        "Enter"
                                                                    ) {
                                                                        setEditingCell(
                                                                            null
                                                                        )
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="min-h-8 cursor-pointer rounded px-2 py-1 hover:bg-muted"
                                                                onClick={() =>
                                                                    setEditingCell(
                                                                        {
                                                                            row: row.index,
                                                                            column:
                                                                                cell
                                                                                    .column
                                                                                    .id,
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {String(
                                                                    cell.getValue() ??
                                                                    ""
                                                                )}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                )
                                            })}

                                        <TableCell>
                                            <button
                                                className="rounded-md border px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                                                onClick={() =>
                                                    deleteRow(
                                                        row.index
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns.length +
                                        1
                                    }
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}