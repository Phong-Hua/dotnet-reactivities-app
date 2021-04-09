using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
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
                var observer = await _context.Users
                // .Include(u => u.Followings)
                .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());
                if (observer == null) return null;

                var target = await _context.Users
                // .Include(u => u.Followers)
                .FirstOrDefaultAsync(u => u.UserName == request.TargetUsername);
                if (target == null) return null;

                var userFollowing = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                if (userFollowing == null)
                {
                    userFollowing = new UserFollowing 
                    {
                        ObserverId = observer.Id,
                        Observer = observer,
                        TargetId = target.Id,
                        Target = target
                    };
                    _context.UserFollowings.Add(userFollowing);
                    // observer.Followings.Add(userFollowing);
                    // target.Followers.Add(userFollowing);
                }
                else
                {
                    _context.UserFollowings.Remove(userFollowing);
                    // observer.Followings.Remove(userFollowing);
                    // target.Followers.Remove(userFollowing);
                }
                var success = await _context.SaveChangesAsync() > 0;
                if (success)
                    return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed to update following");                    
            }
        }
    }
}