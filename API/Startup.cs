
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Application.Activities;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            this._config = config;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // add fluent validation and we want to specify where the validator is
            // we only need to do this once
            services.AddControllers(opt => 
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(config => {
                config.RegisterValidatorsFromAssemblyContaining<Create>();
            });
            services.AddApplicationServices(_config);
            services.AddIdentityServices(_config);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opt => opt.NoReferrer()); // Our browser will not send any referrer information
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode());   // give us cross-site scripting protection
            app.UseXfo(opt => opt.Deny());  // prevent our application from being used in an iFrame somewhere else
            app.UseCsp(opt => opt
                .BlockAllMixedContent()  // it is going to be https only

                // allow style source generated from our domain, or font.googleapis
                .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com")) 
                // .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
                .FormActions(s => s.Self())
                .FrameAncestors(s => s.Self())
                // allow image source generated from our domain, or res.cloudinary.com
                .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com"))
                // allow script source generated from our domain, or hash from security content policy
                .ScriptSources(s => s.Self().CustomSources("sha256-6ys35OdahF1VX2f8hEC+bVxe16U7OAggF5DcAdCzIwM="))
            ); 

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }
            else // in production mode 
            {
                //app.UseHsts();  // this does not work on heroku
                // create piece of middleware to replace app.UseHsts()
                app.Use(async (context, next) => {
                    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");   // 1 year
                    await next.Invoke();
                });
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            // ordering is important
            app.UseDefaultFiles();  // look for anything inside wwwroot folder
            app.UseStaticFiles();   // by default, serve static files from wwwroot folder

            app.UseCors("CorsPolicy");  // this line is after app.UseRouting();

            app.UseAuthentication();    // this need to be before use Authorization
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat"); // name of endpoint
            
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
