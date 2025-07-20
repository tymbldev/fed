"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DropdownIndustry {
  id: string;
  name: string;
}

export default function IndustryDropdown({
  industries,
  selectedId,
}: {
  industries: DropdownIndustry[];
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

  const selected = industries.find((i) => String(i.id) === String(selectedId));

  return (
    <div className="relative inline-block min-w-[220px]" ref={ref}>
      <button
        type="button"
        className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900 focus:outline-none md:pl-2"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white inline-block">{selected ? selected.name : "Select Industry"}</span>
        <svg
          className={`w-6 h-6 ml-2 transition-transform text-gray-900 dark:text-white ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
          {industries.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-lg">No industries found</div>
          ) : (
            industries.map((ind) => (
              <div
                key={ind.id}
                className={`px-4 py-3 cursor-pointer text-gray-900 bg-white hover:bg-blue-50 border-b border-gray-100 text-lg ${
                  String(ind.id) === String(selectedId) ? "bg-blue-100 font-semibold" : ""
                }`}
                onClick={() => {
                  setOpen(false);
                  router.push(`/industries/${ind.id}`);
                }}
              >
                {ind.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}