"use client"

import { cn } from "@/lib/utils"

export default function AutoResizeTextarea ({
  value,
  onChange,
  placeholder,
  className,
  onKeyDown
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      className={cn("resize-none w-full bg-transparent focus:outline-none max-h-[200px] overflow-y-auto", className)}
      style={{ height: "auto" }}
    />
  )
}

