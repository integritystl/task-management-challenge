
using TaskManagement.Infrastructure.Entities;

namespace TaskManagement.Infrastructure
{
    public class TaskRepository : ITaskRepository
    {
        static List<TaskEntity> _tasks;

        static TaskRepository()
        {
            addDefaultTasks();
        }

        public Task<TaskEntity> CreateTask(TaskEntity taskEntity)
        {
            _tasks.Add(taskEntity);
            return Task.FromResult(taskEntity);
        }

        public async Task<List<TaskEntity>> GetAllTasks(int PageNumber, int PageSize)
        {
            return _tasks.OrderByDescending(t => t.DueDate.HasValue)
                .ThenBy(t => t.DueDate)
                .Skip(PageSize * PageNumber)
                .Take(PageSize)
                .ToList();
        }

        static void addDefaultTasks()
        {
            _tasks = new List<TaskEntity>();
            _tasks.Add(new TaskEntity()
            {
                Title = "Task 1",
                Description = "Task Description 1",
                DueDate = DateTime.Now.AddDays(4)
            });
            _tasks.Add(new TaskEntity()
            {
                Title = "Task 1",
                Description = "Task Description 1",
                DueDate = DateTime.Now.AddDays(1)
            });
        }
    }
}
