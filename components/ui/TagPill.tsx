export function TagPill({ label }: { label: string }) {
  return (
    <span className="px-2.5 py-1 rounded-[20px] bg-gray-100 dark:bg-gray-800
                     text-gray-600 dark:text-gray-300 font-inter font-semibold text-[9px]">
      {label}
    </span>
  );
}
