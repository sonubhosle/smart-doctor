import React from 'react';

const Spinner = ({ size = 'medium', color = 'indigo', fullScreen = false }) => {
  const sizeMap = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-20 h-20',
    xlarge: 'w-32 h-32'
  };

  const colorMap = {
    indigo: 'from-indigo-600 to-purple-600',
    emerald: 'from-emerald-500 to-teal-600',
    rose: 'from-rose-500 to-orange-600',
    white: 'from-white to-slate-200'
  };

  const s = sizeMap[size] || sizeMap.medium;
  const c = colorMap[color] || colorMap.indigo;

  const SpinnerContent = () => (
    <div className="flex flex-col items-center justify-center space-y-8 min-h-[100vh] w-full bg-white/50 backdrop-blur-sm">
      <div className={`relative ${s} animate-spin-slow`}>
        {/* Outer Ring */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${c} opacity-20 blur-sm`}></div>

        {/* Main Spinning Gradient Ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 animate-spin-fast`}></div>

        {/* Inner Pulsing Core */}
        <div className={`absolute inset-3 rounded-full bg-gradient-to-br ${c} opacity-40 animate-pulse`}></div>

        {/* Center Glow */}
        <div className="absolute inset-[40%] rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
      </div>

      {size !== 'small' && (
        <div className="flex flex-col items-center">
          <span className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase opacity-80">Loading</span>
          <div className="flex space-x-1 mt-1">
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      )}

      <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-fast {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(1080deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                .animate-spin-fast {
                    animation: spin-fast 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center z-[9999]">
        <SpinnerContent />
      </div>
    );
  }

  return <SpinnerContent />;
};

export const ButtonSpinner = () => (
  <div className="w-4 h-4 relative animate-spin">
    <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
    <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full"></div>
  </div>
);

export const PageLoader = () => (
  <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-100 z-[10000] overflow-hidden">
    <div className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 w-1/3 absolute animate-shimmer"></div>
    <style jsx>{`
            @keyframes shimmer {
                0% { left: -40%; }
                100% { left: 110%; }
            }
            .animate-shimmer {
                animation: shimmer 1.5s infinite linear;
            }
        `}</style>
  </div>
);

export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm animate-pulse">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-100 rounded-full w-1/3"></div>
              <div className="h-3 bg-slate-50 rounded-full w-1/4"></div>
            </div>
          </div>
          {type === 'card' && (
            <div className="mt-8 space-y-4">
              <div className="h-3 bg-slate-50 rounded-full w-full"></div>
              <div className="h-3 bg-slate-50 rounded-full w-5/6"></div>
              <div className="h-3 bg-slate-50 rounded-full w-4/6"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Spinner;