import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
    CheckCircle,
    XCircle,
    Clock,
    BarChart3,
} from "lucide-react";

export default function EvaluationsPage() {
    return (
        <main className="min-h-screen bg-muted/30 p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">
                            Evaluation Run #45
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Dataset: Billing Support Eval • GPT-4o Mini
                        </p>
                    </div>

                    <Button>
                        Run New Evaluation
                    </Button>
                </div>

                {/* Metrics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                                Overall Score
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="text-3xl font-bold">
                                82%
                            </div>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Good Performance
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                                Passed
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />

                                <span className="text-3xl font-bold">
                                    41
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                                Failed
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-red-500" />

                                <span className="text-3xl font-bold">
                                    9
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                                Avg Latency
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-orange-500" />

                                <span className="text-3xl font-bold">
                                    1.42s
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Test Case Results
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="pb-3">
                                            Input
                                        </th>

                                        <th className="pb-3">
                                            Expected Output
                                        </th>

                                        <th className="pb-3">
                                            Score
                                        </th>

                                        <th className="pb-3">
                                            Status
                                        </th>

                                        <th className="pb-3">
                                            Latency
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className="border-b">
                                        <td className="py-4">
                                            I was charged twice this
                                            month.
                                        </td>

                                        <td>
                                            Apologize and offer
                                            investigation.
                                        </td>

                                        <td>1.0</td>

                                        <td>
                                            <Badge>
                                                Passed
                                            </Badge>
                                        </td>

                                        <td>1.21s</td>
                                    </tr>

                                    <tr className="border-b">
                                        <td className="py-4">
                                            I need a refund for my
                                            order.
                                        </td>

                                        <td>
                                            Explain refund process.
                                        </td>

                                        <td>0.0</td>

                                        <td>
                                            <Badge
                                                variant="destructive"
                                            >
                                                Failed
                                            </Badge>
                                        </td>

                                        <td>1.56s</td>
                                    </tr>

                                    <tr className="border-b">
                                        <td className="py-4">
                                            My payment method was
                                            declined.
                                        </td>

                                        <td>
                                            Troubleshoot payment
                                            issue.
                                        </td>

                                        <td>0.5</td>

                                        <td>
                                            <Badge
                                                variant="secondary"
                                            >
                                                Partial
                                            </Badge>
                                        </td>

                                        <td>1.08s</td>
                                    </tr>

                                    <tr>
                                        <td className="py-4">
                                            Can I change my plan?
                                        </td>

                                        <td>
                                            Explain plan change
                                            process.
                                        </td>

                                        <td>1.0</td>

                                        <td>
                                            <Badge>
                                                Passed
                                            </Badge>
                                        </td>

                                        <td>1.11s</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Evaluation Summary
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex items-start gap-3">
                            <BarChart3 className="mt-1 h-5 w-5 text-primary" />

                            <p className="text-muted-foreground">
                                Prompt version 3 performs
                                well on billing inquiries but
                                struggles with refund-related
                                requests. Consider adding more
                                refund-specific instructions
                                to improve coverage.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}