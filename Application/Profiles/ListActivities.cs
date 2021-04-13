using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }   // 'past', 'future', or 'hosting'
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this._mapper = mapper;
                this._context = context;
            }
            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                    .Where(u => u.AppUser.UserName == request.Username)
                    .OrderBy(x => x.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();
                
                switch (request.Predicate) 
                {
                    case "hosting": 
                    {
                        query = query.Where(x => x.HostUsername == request.Username);
                        break;
                    }
                    case "past": 
                    {
                        query = query.Where(x => x.Date <= DateTime.Now);
                        break;
                    }
                    default:
                    {
                        query = query.Where(x => x.Date > DateTime.Now);
                        break;
                    }
                }
                var result = await query.ToListAsync();
                return Result<List<UserActivityDto>>.Success(result);
            }
        }
    }
}