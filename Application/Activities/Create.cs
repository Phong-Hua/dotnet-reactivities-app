using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        // IRequest here return nothing
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

// Even though, we return nothing here, but we still need to return Task<Unit>
// because Unit is a special Object in MediatR, that means nothing.
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // we don't use AddAsync because we are not accessing database at
                // this point
                _context.Activities.Add(request.Activity);

                await _context.SaveChangesAsync();

                // this means return nothing.
                return Unit.Value;
            }
        }
    }
}