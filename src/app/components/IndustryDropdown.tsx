"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Industry {
  industryId: number;
  industryName: string;
}

export default function IndustryDropdown({
  industries,
  selectedId,
}: {
  industries: Industry[];
  selectedId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = industries.find((i) => String(i.industryId) === String(selectedId));

  return (
    <div className="relative inline-block min-w-[220px]" ref={ref}>
      <button
        type="button"
        className="w-full flex items-center justify-between bg-white text-gray-900 px-4 py-2 rounded shadow-sm border border-gray-200 hover:border-blue-400 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{selected ? selected.industryName : "Select Industry"}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 z-50 mt-2 w-full bg-white rounded shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {industries.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No industries found</div>
          ) : (
            industries.map((ind) => (
              <div
                key={ind.industryId}
                className={`px-4 py-2 cursor-pointer text-gray-900 bg-white hover:bg-blue-50 border-b border-gray-100 ${
                  String(ind.industryId) === String(selectedId) ? "bg-blue-100 font-semibold" : ""
                }`}
                style={{ minHeight: "2.5rem" }}
                onClick={() => {
                  setOpen(false);
                  router.push(`/industries/${ind.industryId}`);
                }}
              >
                {ind.industryName}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}