export default function SkeletonCategoryCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-white h-full animate-pulse">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-300 shrink-0" />

      <div className="bg-[#FDF2ED] p-3 flex flex-col items-center justify-center min-h-17.5 flex-1 space-y-2">
        <div className="h-5 w-3/4 rounded bg-gray-300" />
        <div className="h-4 w-1/2 rounded bg-gray-300" />
      </div>
    </div>
  );
}
