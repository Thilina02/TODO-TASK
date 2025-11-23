import { useEffect, useState } from 'react';
import type { Task } from '../services/api';
import { taskApi } from '../services/api';
import TaskCard from './TaskCard';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskComplete = async (id: number) => {
    try {
      await taskApi.completeTask(id);
      await fetchTasks();
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Failed to complete task. Please try again.');
    }
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-blue-200 text-lg font-medium">Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-xl bg-red-500/20 border-2 border-red-400/50 rounded-2xl shadow-xl p-6 animate-shake">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-200 font-semibold text-lg">{error}</p>
        </div>
        <button
          onClick={fetchTasks}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-200 font-medium py-2 px-6 rounded-xl border border-red-400/50 hover:border-red-400 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-5 text-center hover:bg-white/15 transition-all duration-300">
            <div className="text-3xl font-bold text-white mb-1">{tasks.length}</div>
            <div className="text-blue-200 text-sm font-medium">Total Tasks</div>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-5 text-center hover:bg-white/15 transition-all duration-300">
            <div className="text-3xl font-bold text-cyan-300 mb-1">{activeTasks.length}</div>
            <div className="text-blue-200 text-sm font-medium">Active</div>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-5 text-center hover:bg-white/15 transition-all duration-300">
            <div className="text-3xl font-bold text-green-300 mb-1">{completedTasks.length}</div>
            <div className="text-blue-200 text-sm font-medium">Completed</div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {activeTasks.length === 0 && !isLoading ? (
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-12 text-center animate-fade-in">
          <div className="mb-6 inline-block p-6 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full">
            <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No active tasks!</h3>
          <p className="text-blue-200 text-lg">You're all caught up. Create a new task to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTasks.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              <h2 className="text-xl font-bold text-white px-4">
                Active Tasks <span className="text-blue-300">({activeTasks.length})</span>
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            </div>
          )}
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleTaskComplete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

