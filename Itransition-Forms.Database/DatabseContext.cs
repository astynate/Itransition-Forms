using Itransition_Forms.Core.User;
using Microsoft.EntityFrameworkCore;

namespace Itransition_Forms.Database
{
    public class DatabaseContext : DbContext
    {
        public DbSet<UserModel> Users { get; set; } = null!;

        public DatabaseContext() => Database.EnsureCreated();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql("server=localhost;user=root;password=47188475;database=itransition_forms",
                new MySqlServerVersion(new Version(8, 3, 0)),
                mySqlOptions => mySqlOptions.EnableRetryOnFailure());
        }
    }
}