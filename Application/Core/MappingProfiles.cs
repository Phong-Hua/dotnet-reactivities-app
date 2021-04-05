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

            CreateMap<ActivityAttendee, AttendeeDto>()
            // map DisplayName of Profile
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            // map Username of Profile
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            // Map Bio of Profile
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));
            
            // mapping Activity to ActivityDto
            CreateMap<Activity, ActivityDto>()
                // HostUserName in ActivityDto will be the host of Attendees in Activity
                .ForMember(d => d.HostUsername, o => o.MapFrom(
                    s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName
                ));
            
            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(p => p.IsMain).Url));

            // CreateMap<ActivityAttendee, AttendeeDto>()
            // .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            // .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            // .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            
        }
    }
}