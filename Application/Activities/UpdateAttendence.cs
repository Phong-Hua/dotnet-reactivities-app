
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendence
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // get activity include attendees has the id 
                var activity = await _context.Activities
                .Include(a => a.Attendees)
                .ThenInclude(u => u.AppUser)
                .FirstOrDefaultAsync(x => x.Id == request.Id);
                if (activity == null) return null;

                // find current user
                var user = await _context.Users.FirstAsync(x =>
                    x.UserName == _userAccessor.GetUsername());
                if (user == null) return null;

                // find host username
                var hostUsername = activity.Attendees.FirstOrDefault(x =>
                x.IsHost)?.AppUser?.UserName;   // ? is defensive
                if (hostUsername == null) return null;

                // find attendance of the user
                var attendance = activity.Attendees.FirstOrDefault(x =>
                x.AppUser.UserName == user.UserName);

                // host user, cancel activity
                if (attendance != null && hostUsername == user.UserName)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }
                // normal attendee, cancel attendance
                if (attendance != null && hostUsername != user.UserName)
                {
                    activity.Attendees.Remove(attendance);
                }
                // normal attendee, join activity
                if (attendance == null)
                {
                    attendance = new ActivityAttendee {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false,
                    };
                    activity.Attendees.Add(attendance);
                }
                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update attendance");
            }
        }
    }
}