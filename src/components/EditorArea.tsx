import React from "react";
import { cn } from "@/lib/utils";

interface EditorAreaProps {
  title: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export const EditorArea = ({
  title,
  value,
  onChange,
  icon,
  actions,
  placeholder = "Start writing...",
  className,
}: EditorAreaProps) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-rose-100 overflow-hidden transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/50">
        <div className="flex items-center gap-2">
          {icon && <span className="text-rose-400">{icon}</span>}
          <h2 className="text-lg font-semibold text-rose-900">{title}</h2>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>

      {/* Editor Space */}
      <div className="flex-1 p-6">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full resize-none outline-none text-lg leading-relaxed text-slate-800 font-serif placeholder:text-rose-300 bg-transparent selection:bg-rose-200"
          spellCheck={false}
        />
      </div>
      
      {/* Word Count Footer */}
      <div className="px-6 py-3 border-t border-rose-50 bg-rose-50/30 text-xs font-medium text-rose-400 flex justify-end">
        {value.trim().split(/\s+/).filter((word) => word.length > 0).length} words
      </div>
    </div>
  );
};