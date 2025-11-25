import { TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton({ rows = 5, columns = 5 }) {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                    {[...Array(columns)].map((_, j) => (
                        <TableCell key={j}>
                            <Skeleton
                                className="h-6 w-full"
                                style={{
                                    animationDelay: `${(i * 0.05) + (j * 0.02)}s`
                                }}
                            />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    )
}
