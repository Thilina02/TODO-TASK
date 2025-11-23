import { useState, type FormEvent } from 'react';
import type { CreateTaskInput } from '../services/api';
import { taskApi } from '../services/api';

interface TaskFormProps {
  onTaskCreated: () => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validateTitle = (value: string): boolean => {
    if (!value.trim()) {
      setTitleError('Task title is required');
      return false;
    }
    setTitleError(null);
    return true;
  };

  const validateDescription = (value: string): boolean => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setDescriptionError('Description is required');
      return false;
    }

    if (trimmedValue.length <= 10) {
      setDescriptionError('Description must be more than 10 characters');
      return false;
    }

    setDescriptionError(null);
    return true;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (submitAttempted) {
      validateTitle(value);
    } else {
      setTitleError(null);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    if (submitAttempted) {
      validateDescription(value);
    } else {
      setDescriptionError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    setSubmitAttempted(true);

    const isTitleValid = validateTitle(title);
    const isDescriptionValid = validateDescription(description);

    if (!isTitleValid || !isDescriptionValid) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData: CreateTaskInput = {
        title: title.trim(),
        description: description.trim(),
      };

      await taskApi.createTask(taskData);
      setTitle('');
      setDescription('');
      setTitleError(null);
      setDescriptionError(null);
      setSubmitAttempted(false); 
      onTaskCreated();
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Create New Task</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-blue-200 mb-2">
            Task Title <span className="text-blue-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full px-5 py-3.5 bg-white/10 backdrop-blur-sm border-2 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                submitAttempted && titleError
                  ? 'border-red-400 shadow-lg shadow-red-500/20'
                  : isFocused
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'border-white/20'
              }`}
              placeholder="What needs to be done?"
              disabled={isSubmitting}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {submitAttempted && !titleError && title.trim() && (
                <svg className="w-5 h-5 text-blue-300 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              )}
              {submitAttempted && titleError && (
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div> 
          {submitAttempted && titleError && (
            <p className="mt-2 text-sm text-red-300 flex items-center gap-1 animate-fade-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {titleError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-blue-200 mb-2">
            Description <span className="text-blue-400">*</span>
            {description && (
              <span className="text-blue-300/70 text-xs ml-2">
                ({description.trim().length} / 10+ characters)
              </span>
            )}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            rows={4}
            className={`w-full px-5 py-3.5 bg-white/10 backdrop-blur-sm border-2 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 hover:border-white/30 ${
              submitAttempted && descriptionError
                ? 'border-red-400 shadow-lg shadow-red-500/20'
                : submitAttempted && description.trim().length > 10 && !descriptionError
                  ? 'border-green-400/50 shadow-lg shadow-green-500/10'
                  : 'border-white/20'
            }`}
            placeholder="Add description (must be more than 10 characters)..."
            disabled={isSubmitting}
          /> 
          {submitAttempted && descriptionError && (
            <p className="mt-2 text-sm text-red-300 flex items-center gap-1 animate-fade-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {descriptionError}
            </p>
          )} 
          {submitAttempted && !descriptionError && description.trim().length > 0 && description.trim().length <= 10 && (
            <p className="mt-2 text-sm text-yellow-300 flex items-center gap-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {10 - description.trim().length + 1} more character(s) required
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 flex items-center gap-3 animate-shake">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-200 text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Task...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Task
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </form>
    </div>
  );
}

