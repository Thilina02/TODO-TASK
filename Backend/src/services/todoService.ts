import prisma from '../prisma';

export type Todo = Awaited<ReturnType<typeof prisma.todo.create>>;

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

class TodoService {
  async createTodo(data: CreateTodoInput): Promise<NonNullable<Todo>> {
    return await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description || null,
      },
    });
  }

  async getRecentTodos(limit: number = 5): Promise<NonNullable<Todo>[]> {
    return await prisma.todo.findMany({
      where: {
        completed: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async markTodoAsCompleted(id: number): Promise<NonNullable<Todo>> {
    return await prisma.todo.update({
      where: { id },
      data: { completed: true },
    });
  }

  async getTodoById(id: number): Promise<Todo | null> {
    return await prisma.todo.findUnique({
      where: { id },
    });
  }
}

export default new TodoService();

