import React from 'react';

interface SkeletonLoaderProps {
  type: 'card' | 'list' | 'text' | 'data-grid';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-black/50 border border-green-500/30 rounded-lg p-4 sm:p-6 animate-pulse ${className}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-500/20 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-green-500/20 rounded mb-2"></div>
                <div className="h-3 bg-green-500/10 rounded w-2/3"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-green-500/10 rounded"></div>
              <div className="h-3 bg-green-500/10 rounded w-4/5"></div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 animate-pulse">
                <div className="h-3 bg-green-500/20 rounded w-1/3"></div>
                <div className="h-3 bg-green-500/10 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-2 animate-pulse ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="h-3 bg-green-500/20 rounded" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
            ))}
          </div>
        );

      case 'data-grid':
        return (
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-green-500/10 border border-green-500/30 rounded p-4 text-center animate-pulse">
                <div className="h-8 bg-green-500/20 rounded mb-2"></div>
                <div className="h-3 bg-green-500/10 rounded"></div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return <>{renderSkeleton()}</>;
};

export default SkeletonLoader;