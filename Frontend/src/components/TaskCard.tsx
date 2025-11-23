import type { Task } from '../services/api';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onComplete: (id: number) => void;
}

export default function TaskCard({ task, onComplete }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onComplete(task.id);
    } finally {
      setTimeout(() => setIsCompleting(false), 500);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (task.completed) {
    return null; 
  }

  return (
    <div
      className={`backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/15 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group ${
        isCompleting ? 'opacity-50 pointer-events-none' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-blue-200/80 leading-relaxed whitespace-pre-wrap break-words">
              {task.description}
            </p>
          )}
        </div>
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-blue-500/50 font-semibold flex items-center gap-2 group/btn"
        >
          {isCompleting ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Completing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 group-hover/btn:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Complete</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-white/10">
        <svg className="w-4 h-4 text-blue-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-blue-300/70 font-medium">
          Created {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
}

