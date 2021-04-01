using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            this._httpContextAccessor = httpContextAccessor;
            this._dbContext = dbContext;

        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);  // we want to find userId
            if (userId == null) return Task.CompletedTask;  // user not meet requirement

            // find activity id
            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
            .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            var attendee = _dbContext.ActivityAttendees
            .AsNoTracking()
            .SingleOrDefaultAsync(a => a.AppUserId == userId && a.ActivityId == activityId)
            .Result;

            if (attendee == null) return Task.CompletedTask;    // no attendee
            if (attendee.IsHost)
                context.Succeed(requirement);
            // Because we already set context.Succeed => user is authorized
            // we continue
            return Task.CompletedTask;
        }
    }
}