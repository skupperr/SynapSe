"use client"

import { Button } from "@/components/ui/button";

interface Props {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const DataPagination = ({ page, totalPages, onPageChange }: Props) => {
    const safeTotalPages = Math.max(1, totalPages)
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
                {/* Page {page} of {totalPages || 1} */}
                Page {page} of {safeTotalPages}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button 
                    // disabled={page === 1}
                    disabled={page <= 1}
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                >
                    Previous
                </Button>
                <Button 
                    // disabled={page === totalPages || page === 0}
                    disabled={page >= safeTotalPages}
                    variant={"outline"}
                    size={"sm"}
                    // onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}