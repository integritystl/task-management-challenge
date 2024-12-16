using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Infrastructure;

namespace TaskManagement.Core.Queries
{
    public class TaskListQueryHandler : IRequestHandler<TaskListQuery, List<TaskDto>>
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IMapper _mapper;
        public TaskListQueryHandler(IMapper mapper, ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
            _mapper = mapper;
        }
        public async Task<List<TaskDto>> Handle(TaskListQuery request, CancellationToken cancellationToken)
        {
            return _mapper.Map<List<TaskDto>>(await _taskRepository.GetAllTasks(request.PageNumber, request.PageSize));
        }
    }
}
