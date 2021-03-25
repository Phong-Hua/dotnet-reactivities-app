using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        // IRequest here return nothing
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

// Even though, we return nothing here, but we still need to return Task<Unit>
// because Unit is a special Object in MediatR, that means nothing.
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // we don't use AddAsync because we are not accessing database at
                // this point
                _context.Activities.Add(request.Activity);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) 
                    return Result<Unit>.Failure("Failed to create activity");
                return Result<Unit>.Success(Unit.Value);
                // this means return nothing.
                // return Unit.Value;
            }
        }
    }
}