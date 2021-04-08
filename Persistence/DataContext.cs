using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        // constructor of DataContext, base(options) is constructor of DbContext
        public DataContext(DbContextOptions options) : base(options)
        {}

        // name 'Activities' reflects the name of table.
        // We are gonna call our table 'Activities'
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos {get; set; }
        public DbSet<Comment> Comments { get; set; }

        // Override the OnModelCreating method from DBContext
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // make a primary key is a combination of both the AppUser id and Activity id
            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new {aa.AppUserId, aa.ActivityId})); 
            
            // config One AppUser to Many Activities
            builder.Entity<ActivityAttendee>()
            .HasOne(u => u.AppUser)
            .WithMany(a => a.Activities)
            .HasForeignKey(aa => aa.AppUserId);

            // config One Activity to Many Attendees
            builder.Entity<ActivityAttendee>()
            .HasOne(u => u.Activity)
            .WithMany(a => a.Attendees)
            .HasForeignKey(aa => aa.ActivityId);

            builder.Entity<Comment>()
            .HasOne(u => u.Activity)
            .WithMany(c => c.Comments)
            .OnDelete(DeleteBehavior.Cascade);  // if we delete an activity => it will delete related comments
        }
    }
}