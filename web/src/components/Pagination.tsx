import { useMemo } from "react";

// props
type PaginationProps = {
  page: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
};

export default function Pagination({page,total,pageSize,onPage}: PaginationProps){

    const pages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

    const go = (p: number) => {
        const target = Math.min(pages, Math.max(1, p));
        onPage(target);
    }

    const rootClass = useMemo(() => {
        return "flex items-center gap-2 text-sm"
    }, []);
    
    const btnClass = useMemo(() => {
        return "px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
    }, []);


    return (
        <div className={rootClass}>
            <button className={btnClass} onClick={() => go(1)} disabled={page === 1}>First</button>
            <button className={btnClass} onClick={() => go(page - 1)} disabled={page === 1}>Prev</button>
            <span className="px-2 py-1 ">Page {page} of {pages}</span>
            <button className={btnClass} onClick={() => go(page + 1)} disabled={page === pages}>Next</button>
            <button className={btnClass} onClick={() => go(pages)} disabled={page === pages}>Last</button>
        </div>
    )
}