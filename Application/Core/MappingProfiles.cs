using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // specify where we want to map from and to
            // we are mapping from Activity to Activity
            CreateMap<Activity, Activity>();
        }
    }
}