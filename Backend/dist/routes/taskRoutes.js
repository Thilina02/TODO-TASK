"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = __importDefault(require("../controllers/taskController"));
const router = (0, express_1.Router)();
router.post('/tasks', taskController_1.default.createTask.bind(taskController_1.default));
router.get('/tasks', taskController_1.default.getTasks.bind(taskController_1.default));
router.patch('/tasks/:id/complete', taskController_1.default.completeTask.bind(taskController_1.default));
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map