export default function SkeletonCategoryCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-white shadow-sm animate-pulse">
      <div className="h-40 sm:h-48 md:h-52 shrink-0 bg-gray-300" />

      <div className="bg-[#FDF2ED] p-3 flex flex-col items-center justify-center min-h-[70px] space-y-2">
        <div className="h-5 w-3/4 rounded bg-gray-300" />
        <div className="h-4 w-1/2 rounded bg-gray-300" />
      </div>
    </div>
  );
}
