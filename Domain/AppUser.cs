using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<ActivityAttendee> Activities { get; set; } = new List<ActivityAttendee>();   // initialize value
        public ICollection<Photo> Photos { get; set; }  // One - Many relationship
        public ICollection<UserFollowing> Followings { get; set; } // who is the current user following
        public ICollection<UserFollowing> Followers { get; set; } // who is following this user
    }
}