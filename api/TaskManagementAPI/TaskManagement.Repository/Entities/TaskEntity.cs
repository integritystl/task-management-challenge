using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Infrastructure.Entities
{
    public class TaskEntity
    {
        public TaskEntity()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.Now;
            Priority = Priority.MEDIUM;
            Status = "TODO";
        }

        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Priority Priority { get; set; }
        public string Status { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
