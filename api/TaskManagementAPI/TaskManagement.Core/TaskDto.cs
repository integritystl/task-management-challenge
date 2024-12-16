namespace TaskManagement.Core
{
    public class TaskDto
    {
        public TaskDto()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.Now;
            Priority = "MEDIUM";
            Status = "TODO";
        }

        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public string DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; } 

    }
}