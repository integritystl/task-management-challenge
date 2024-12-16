

using TaskManagement.Infrastructure.Entities;

namespace TaskManagement.Infrastructure
{
    public interface ITaskRepository
    {
        Task<List<TaskEntity>> GetAllTasks(int PageNumber, int PageSize);
        Task<TaskEntity> CreateTask(TaskEntity taskEntity);
    }
}
