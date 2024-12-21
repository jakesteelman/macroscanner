import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EntryCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="w-full aspect-[3/2]" />
            <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                </div>
            </CardContent>
        </Card>
    )
}
