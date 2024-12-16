using AutoMapper;
using TaskManagement.Core;
using TaskManagement.Infrastructure.Entities;

namespace TaskManagementAPI.Util
{

    public class MappingProfile : Profile
    {
        public MappingProfile()
        { 
            CreateMap<TaskEntity, TaskDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Priority.ToString()))
                .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => src.DueDate.ToString())).ReverseMap()
                .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => (string.IsNullOrEmpty(src.DueDate) ? (DateTime?)null : DateTime.Parse(src.DueDate))));
        }
    }

}
