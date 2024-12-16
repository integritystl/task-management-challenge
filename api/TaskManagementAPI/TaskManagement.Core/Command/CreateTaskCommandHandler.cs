using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Infrastructure;
using TaskManagement.Infrastructure.Entities;

namespace TaskManagement.Core.Queries
{
    public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, TaskDto>
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IMapper _mapper;
        public CreateTaskCommandHandler(IMapper mapper, ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
            _mapper = mapper;
        }
        public async Task<TaskDto> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
        {
            var TaskEntity = _mapper.Map<TaskEntity>(request.Task);
            return _mapper.Map<TaskDto>(await _taskRepository.CreateTask(TaskEntity));
        }
    }
}
