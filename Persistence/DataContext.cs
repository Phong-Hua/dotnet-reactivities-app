using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        // constructor of DataContext, base(options) is constructor of DbContext
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        // name 'Activities' reflects the name of table.
        // We are gonna call our table 'Activities'
        public DbSet<Activity> Activities { get; set; }
    }
}