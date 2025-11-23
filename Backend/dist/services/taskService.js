"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../prisma.js"));
class TaskService {
    async createTask(data) {
        return await prisma_js_1.default.todo.create({
            data: {
                title: data.title,
                description: data.description || null,
            },
        });
    }
    async getRecentTasks(limit = 5) {
        return await prisma_js_1.default.todo.findMany({
            where: {
                completed: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
    }
    async markTaskAsCompleted(id) {
        return await prisma_js_1.default.todo.update({
            where: { id },
            data: { completed: true },
        });
    }
    async getTaskById(id) {
        return await prisma_js_1.default.todo.findUnique({
            where: { id },
        });
    }
}
exports.default = new TaskService();
//# sourceMappingURL=taskService.js.map