import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Prompt Studio",
    description: "Evaluate prompts and datasets",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn(
                "h-full antialiased font-sans",
                geistSans.variable,
                geistMono.variable,
                figtree.variable
            )}
        >
            <body className="min-h-full">
                <ClerkProvider>
                    {children}
                    <Toaster></Toaster>
                </ClerkProvider>
                

            </body>
        </html>
    );
}