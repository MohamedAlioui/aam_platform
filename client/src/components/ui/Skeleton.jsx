const Skeleton = ({ className = '', lines = 1 }) => {
  if (lines > 1) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton rounded"
            style={{ height: '14px', width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    );
  }
  return <div className={`skeleton rounded ${className}`} />;
};

export const CardSkeleton = () => (
  <div className="glass rounded-2xl overflow-hidden p-0">
    <Skeleton className="w-full h-48" />
    <div className="p-5">
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton lines={2} />
      <div className="flex gap-3 mt-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);

export default Skeleton;
