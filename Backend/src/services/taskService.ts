import prisma from '../prisma';

export type Task = Awaited<ReturnType<typeof prisma.task.create>>;

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

class TaskService {
  async createTask(data: CreateTaskInput): Promise<NonNullable<Task>> {
    return await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
      },
    });
  }

  async getRecentTasks(limit: number = 5): Promise<NonNullable<Task>[]> {
    return await prisma.task.findMany({
      where: {
        completed: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async markTaskAsCompleted(id: number): Promise<NonNullable<Task>> {
    return await prisma.task.update({
      where: { id },
      data: { completed: true },
    });
  }

  async getTaskById(id: number): Promise<Task | null> {
    return await prisma.task.findUnique({
      where: { id },
    });
  }
}

export default new TaskService();

