using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Core.Queries
{
    public class CreateTaskCommand : IRequest<TaskDto>
    {
        public CreateTaskCommand(TaskDto taskDto)
        {
            this.Task = taskDto;
        }
        public TaskDto Task { get; set; } 
    }
}
