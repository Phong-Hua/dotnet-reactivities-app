using System.Linq;
using Application.Activities;
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

            CreateMap<ActivityAttendee, Profiles.Profile>()
            // map DisplayName of Profile
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            // map Username of Profile
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            // Map Bio of Profile
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));

            // mapping Activity to ActivityDto
            CreateMap<Activity, ActivityDto>()
                // HostUserName in ActivityDto will be the host of Attendees in Activity
                .ForMember(d => d.HostUsername, o => o.MapFrom(
                    s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName
                ));
            
        }
    }
}