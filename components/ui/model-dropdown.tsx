import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ModelDropdown() {
    return (
        <Select>
            <SelectTrigger>
                <SelectValue placeholder="Choose a model" />
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="gpt-4o">
                    GPT-4o
                </SelectItem>

                <SelectItem value="gpt-4o-mini">
                    GPT-4o Mini
                </SelectItem>

                <SelectItem value="claude-sonnet">
                    Claude Sonnet
                </SelectItem>

                <SelectItem value="gemini">
                    Gemini
                </SelectItem>
            </SelectContent>
        </Select>
    );
}