using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Core;
using TaskManagement.Core.Queries;

namespace TaskManagementAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskController : ControllerBase
    { 
        private readonly ILogger<TaskController> _logger;
        private readonly IMediator _mediator;

        public TaskController(ILogger<TaskController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<List<TaskDto>> Get(int pageNumber, int pageSize)
        { 
            return await _mediator.Send(new TaskListQuery(pageNumber, pageSize));
        }

        [HttpPost]
        public async Task<TaskDto> Post(TaskDto taskDto)
        {
            return await _mediator.Send(new CreateTaskCommand(taskDto));
        }
    }
}