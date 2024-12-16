using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Core.Queries
{
    public class TaskListQuery : IRequest<List<TaskDto>>
    {
        public TaskListQuery(int PageNumber, int PageSize)
        {
            this.PageNumber =   PageNumber;
            this.PageSize = PageSize == 0 ? 10 : PageSize;
        }

        public List<Task> Tasks { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
