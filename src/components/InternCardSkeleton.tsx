export default function InternCardSkeleton() {
  return (
    <div className="w-full max-w-sm p-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow animate-pulse">
      <div className="w-full h-[180px] bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-400 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-400 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-400 rounded w-5/6"></div>
    </div>
  );
}
