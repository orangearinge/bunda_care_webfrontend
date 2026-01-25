import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { IconStarFilled, IconMessageReport } from "@tabler/icons-react"

export function FeedbackDetailDialog({ feedback, open, onOpenChange }) {
    if (!feedback) return null

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: 'long',
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const renderClassificationBadge = (classification) => {
        if (!classification) return <Badge variant="outline">Pending</Badge>

        // Handle raw JSON-like string if any
        let processedClassification = classification
        if (typeof classification === 'string' && (classification.startsWith('{') || classification.includes('"prediction"'))) {
            try {
                const parsed = JSON.parse(classification.replace(/'/g, '"'))
                processedClassification = parsed.prediction || classification
            } catch (e) {
                if (classification.includes("'prediction': 'positive'")) processedClassification = "positive"
                else if (classification.includes("'prediction': 'negative'")) processedClassification = "negative"
            }
        }

        const label = String(processedClassification).toLowerCase()
        const isPositive = label === "positif" || label === "positive"
        const isNegative = label === "negatif" || label === "negative"
        const displayText = label === "positive" ? "Positif" : (label === "negative" ? "Negatif" : processedClassification)

        return (
            <Badge
                variant={isPositive ? "default" : (isNegative ? "destructive" : "secondary")}
                className="border-none px-3"
            >
                {displayText}
            </Badge>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconMessageReport className="size-5" />
                        Feedback Details
                    </DialogTitle>
                    <DialogDescription>
                        Submitted by <span className="font-medium text-foreground">{feedback.user_name || "Anonymous"}</span> on {formatDate(feedback.created_at)}
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="grid gap-6 py-4">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-muted-foreground">Rating</Label>
                            <div className="flex items-center gap-1.5">
                                <span className="text-2xl font-bold">{feedback.rating}</span>
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <IconStarFilled
                                            key={i}
                                            className={`size-4 ${i < feedback.rating ? "fill-current" : "text-muted/30"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-muted-foreground">AI Sentiment Analysis</Label>
                            <div>
                                {renderClassificationBadge(feedback.classification)}
                            </div>
                        </div>
                    </div>

                    {/* ID Info */}
                    <div className="text-xs text-muted-foreground">
                        <p>Feedback ID: <span className="font-mono">{feedback.id}</span></p>
                        {feedback.user_id && <p>User ID: <span className="font-mono">{feedback.user_id}</span></p>}
                    </div>

                    <Separator />

                    {/* Comment Section */}
                    <div className="space-y-3">
                        <Label className="text-base">Full Comment</Label>
                        <div className="bg-muted/50 p-4 rounded-lg border text-sm leading-relaxed whitespace-pre-wrap">
                            {feedback.comment || "No comment provided."}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
