import { describe, expect, it, vi, beforeEach } from 'vitest';

import {
  createTodoApi,
  deleteTodoApi,
  getGoalsByTaskApi,
  getTodayTodosApi,
  getTodoApi,
  getTodoListApi,
  getTodoWithGoalsApi,
  updateTodoApi,
  updateTodoProgressApi,
  updateTodoStatusApi,
  createGoalApi,
  updateGoalApi,
  updateGoalStatusApi,
  deleteGoalApi,
  aiGenerateGoalsApi,
} from '../todo';

// Mock the requestClient
vi.mock('../request', () => ({
  requestClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { requestClient } from '../request';

const mockGet = requestClient.get as vi.Mock;
const mockPost = requestClient.post as vi.Mock;
const mockPut = requestClient.put as vi.Mock;
const mockDelete = requestClient.delete as vi.Mock;

describe('todo API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTodoListApi', () => {
    it('should fetch paginated todo list with default params', async () => {
      const mockResponse = {
        items: [
          {
            id: 1,
            title: '测试任务',
            task_type: 0,
            status: 0,
            priority: 1,
            progress: 0,
            source: 1,
            created_by: 1,
            created_time: '2024-01-01T00:00:00',
          },
        ],
        page: 1,
        size: 20,
        total: 1,
        total_pages: 1,
        links: { first: '', last: '', self: '' },
      };
      mockGet.mockResolvedValue(mockResponse);

      const result = await getTodoListApi({ page: 1, size: 20 });

      expect(mockGet).toHaveBeenCalledWith('/api/v1/todos', {
        params: { page: 1, size: 20 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch with query filters', async () => {
      mockGet.mockResolvedValue({ items: [], page: 1, size: 20, total: 0, total_pages: 0, links: { first: '', last: '', self: '' } });

      await getTodoListApi({ title: 'test', status: 0, priority: 1, task_type: 0, source: 1 });

      expect(mockGet).toHaveBeenCalledWith('/api/v1/todos', {
        params: { title: 'test', status: 0, priority: 1, task_type: 0, source: 1 },
      });
    });
  });

  describe('getTodayTodosApi', () => {
    it('should fetch today todos', async () => {
      const mockResponse = [
        { id: 1, title: '今日任务', status: 0 },
      ];
      mockGet.mockResolvedValue(mockResponse);

      const result = await getTodayTodosApi();

      expect(mockGet).toHaveBeenCalledWith('/api/v1/todos/today');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTodoApi', () => {
    it('should fetch a single todo by pk', async () => {
      const mockTodo = { id: 1, title: '测试任务' };
      mockGet.mockResolvedValue(mockTodo);

      const result = await getTodoApi(1);

      expect(mockGet).toHaveBeenCalledWith('/api/v1/todos/1');
      expect(result).toEqual(mockTodo);
    });
  });

  describe('getTodoWithGoalsApi', () => {
    it('should fetch a todo with goals', async () => {
      const mockResponse = {
        id: 1,
        title: '测试任务',
        goals: [
          { id: 1, title: '目标1', status: 0, task_id: 1, ai_generated: false, created_by: 1, created_time: '2024-01-01T00:00:00' },
        ],
      };
      mockGet.mockResolvedValue(mockResponse);

      const result = await getTodoWithGoalsApi(1);

      expect(mockGet).toHaveBeenCalledWith('/api/v1/todos/1/with-goals');
      expect(result.goals).toHaveLength(1);
      expect(result.goals[0].title).toBe('目标1');
    });
  });

  describe('createTodoApi', () => {
    it('should create a todo and return it', async () => {
      const newTodo = { title: '新任务', task_type: 0, priority: 1, source: 1 };
      const mockCreated = { id: 1, ...newTodo, status: 0, progress: 0, created_by: 1, created_time: '2024-01-01T00:00:00' };
      mockPost.mockResolvedValue(mockCreated);

      const result = await createTodoApi(newTodo);

      expect(mockPost).toHaveBeenCalledWith('/api/v1/todos', newTodo);
      expect(result).toEqual(mockCreated);
    });

    it('should create a todo with all optional fields', async () => {
      const fullTodo = {
        title: '完整任务',
        description: '描述',
        task_type: 1,
        priority: 2,
        source: 0,
        assigned_to: 2,
        due_date: '2024-12-31T23:59:59',
        start_date: '2024-01-01T00:00:00',
        tags: ['重要', '紧急'],
        sort_order: 1,
        remark: '备注',
        cron_expr: '0 0 * * *',
        period_days: 7,
      };
      mockPost.mockResolvedValue({ id: 2, ...fullTodo, status: 0, progress: 0, created_by: 1, created_time: '2024-01-01T00:00:00' });

      await createTodoApi(fullTodo);

      expect(mockPost).toHaveBeenCalledWith('/api/v1/todos', fullTodo);
    });
  });

  describe('updateTodoApi', () => {
    it('should update a todo', async () => {
      const updateData = { title: '更新后的任务' };
      mockPut.mockResolvedValue(undefined);

      await updateTodoApi(1, updateData);

      expect(mockPut).toHaveBeenCalledWith('/api/v1/todos/1', updateData);
    });
  });

  describe('updateTodoStatusApi', () => {
    it('should update todo status', async () => {
      mockPut.mockResolvedValue(undefined);

      await updateTodoStatusApi(1, 2);

      expect(mockPut).toHaveBeenCalledWith('/api/v1/todos/1/status', null, {
        params: { status: 2 },
      });
    });
  });

  describe('updateTodoProgressApi', () => {
    it('should update todo progress', async () => {
      mockPut.mockResolvedValue(undefined);

      await updateTodoProgressApi(1, { progress: 50 });

      expect(mockPut).toHaveBeenCalledWith('/api/v1/todos/1/progress', {
        progress: 50,
      });
    });
  });

  describe('deleteTodoApi', () => {
    it('should delete a todo by pk', async () => {
      mockDelete.mockResolvedValue(undefined);

      await deleteTodoApi(1);

      expect(mockDelete).toHaveBeenCalledWith('/api/v1/todos/1');
    });
  });

  describe('goals API', () => {
    it('getGoalsByTaskApi should fetch goals for a task', async () => {
      const mockGoals = [
        { id: 1, title: '目标1', status: 0, task_id: 1, ai_generated: false, created_by: 1, created_time: '2024-01-01T00:00:00' },
      ];
      mockGet.mockResolvedValue(mockGoals);

      const result = await getGoalsByTaskApi(1);

      expect(mockGet).toHaveBeenCalledWith('/api/v1/todo-goals/by-task/1');
      expect(result).toEqual(mockGoals);
    });

    it('createGoalApi should create a goal', async () => {
      const newGoal = { task_id: 1, title: '新目标', description: '目标描述', stage_order: 1 };
      const mockCreated = { id: 1, ...newGoal, status: 0, ai_generated: false, created_by: 1, created_time: '2024-01-01T00:00:00' };
      mockPost.mockResolvedValue(mockCreated);

      const result = await createGoalApi(newGoal);

      expect(mockPost).toHaveBeenCalledWith('/api/v1/todo-goals', newGoal);
      expect(result).toEqual(mockCreated);
    });

    it('updateGoalApi should update a goal', async () => {
      const updateData = { task_id: 1, title: '更新目标' };
      mockPut.mockResolvedValue(undefined);

      await updateGoalApi(1, updateData);

      expect(mockPut).toHaveBeenCalledWith('/api/v1/todo-goals/1', updateData);
    });

    it('updateGoalStatusApi should update goal status', async () => {
      mockPut.mockResolvedValue(undefined);

      await updateGoalStatusApi(1, { status: 2 });

      expect(mockPut).toHaveBeenCalledWith('/api/v1/todo-goals/1/status', {
        status: 2,
      });
    });

    it('deleteGoalApi should delete a goal', async () => {
      mockDelete.mockResolvedValue(undefined);

      await deleteGoalApi(1);

      expect(mockDelete).toHaveBeenCalledWith('/api/v1/todo-goals/1');
    });

    it('aiGenerateGoalsApi should generate goals via AI', async () => {
      const mockGoals = [
        { id: 1, title: 'AI目标1', status: 0, task_id: 1, ai_generated: true, created_by: 1, created_time: '2024-01-01T00:00:00' },
      ];
      mockPost.mockResolvedValue(mockGoals);

      const result = await aiGenerateGoalsApi(1);

      expect(mockPost).toHaveBeenCalledWith('/api/v1/todo-goals/ai-generate/1');
      expect(result).toEqual(mockGoals);
    });
  });
});
