export default function InternCardSkeleton() {
  return (
    <div className="bg-gray-200 animate-pulse rounded-md shadow p-4 h-full flex flex-col">
      <div className="w-full aspect-[3/2] bg-gray-300 rounded mb-4" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-300 rounded w-full mb-2" />
      <div className="h-3 bg-gray-300 rounded w-5/6" />
    </div>
  );
}
