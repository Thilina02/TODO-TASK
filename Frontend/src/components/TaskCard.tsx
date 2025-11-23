import type { Task } from '../services/api';

interface TaskCardProps {
  task: Task;
  onComplete: (id: number) => void;
}

export default function TaskCard({ task, onComplete }: TaskCardProps) {
  const handleComplete = () => {
    onComplete(task.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800 flex-1 mr-4">
          {task.title}
        </h3>
        <button
          onClick={handleComplete}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm font-medium"
        >
          Done
        </button>
      </div>
      {task.description && (
        <p className="text-gray-600 mb-4 whitespace-pre-wrap">
          {task.description}
        </p>
      )}
      <div className="text-sm text-gray-500">
        Created: {formatDate(task.createdAt)}
      </div>
    </div>
  );
}

