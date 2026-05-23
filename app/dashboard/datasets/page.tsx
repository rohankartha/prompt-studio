import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Page() {
    return (
        <main className="min-h-screen p-8 bg-muted">
            <Card>
                <CardHeader className="text-4xl font-bold">
                    Datasets
                </CardHeader>

                <CardContent>
                    <CardContent>
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="p-4">
                                    <h2 className="font-semibold">
                                        Billing Support Eval
                                    </h2>

                                    <p className="text-muted-foreground text-sm">
                                        10 test cases
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <h2 className="font-semibold">
                                        Refund Requests
                                    </h2>

                                    <p className="text-muted-foreground text-sm">
                                        18 test cases
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </CardContent>

            </Card>

        </main>
    );
}