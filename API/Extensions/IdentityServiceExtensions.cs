using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using System.Text;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, 
        IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt => {  // add configuration for password for example
                opt.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<DataContext>()    // register user store and role store with our app
            .AddSignInManager<SignInManager<AppUser>>();
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt => {
                // We are not doing bullet proof validation, we are just
                // implement easiest thing to work with API
                opt.TokenValidationParameters = new TokenValidationParameters 
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                }; 
                // for signalR
                opt.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context => 
                    {
                        // we get access_token from query string, that we send with SignalR connection 
                        // when we connect to signalR hub
                        var accessToken = context.Request.Query["access_token"];// "access_token" is need to be exactly
                        var path = context.HttpContext.Request.Path;
                        // if the path matches with "/chat" for signalR, we add the token to context
                        // this will allow us to get username or anything else if we needed it from
                        // our context
                        if(!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });   // need it in order to access to SignInManager
            
            services.AddAuthorization(opt => 
            {
                opt.AddPolicy("IsActivityHost", policy => 
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

            services.AddScoped<TokenService>();
            
            return services;
        }
    }
}