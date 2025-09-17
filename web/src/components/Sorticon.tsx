import { SortDir } from "@/app/types";
import ArrowUpIcon from "./ArrowUpIcon";
import ArrowDownIcon from "./ArrowDownIcon";

export default function SortIcon({active,dir}: {active: boolean, dir: SortDir}){
  return (
    <span className="text-sm" style={{opacity: active ? 1 : 0.25,marginLeft: 6}}>
      {dir === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </span>
  )
}