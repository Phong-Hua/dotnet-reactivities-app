using System;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        // Step 1: constructor
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            this._mediator = mediator;
        }

        // Step 2: Send all comment to new connection
        // We only do this when we connect, it will automatically remove the client
        // or connection id from any group when a client disconnect from SignalR
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            // we get activityId from the httpContext
            var activityId = httpContext.Request.Query["activityId"];
            // Add the connectionId to the group has related activityId
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
            var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)});
            // send all comments to client who making request
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }

        // Step 3: Send new comment to all connections that connect to activityId
        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);
            // After a commend is sent to database, it is gonna have Id
            // we want to send that to everybody invove
            await Clients.Group(command.ActivityId.ToString())
            // ReceiveComment is a method name, in client-side we receive by this method
                .SendAsync("ReceiveComment", comment.Value);  
        }
    }
}