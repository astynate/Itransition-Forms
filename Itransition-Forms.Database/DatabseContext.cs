using Itransition_Forms.Core.Answers;
using Itransition_Forms.Core.Form;
using Itransition_Forms.Core.Links.Entities;
using Itransition_Forms.Core.User;
using Microsoft.EntityFrameworkCore;

namespace Itransition_Forms.Database
{
    public class DatabaseContext : DbContext
    {

        /// <summary>
        /// Account entities
        /// </summary>
        public DbSet<UserModel> Users { get; set; } = null!;

        /// <summary>
        /// Form entities
        /// </summary>
        public DbSet<FormModel> Forms { get; set; } = null!;
        public DbSet<QuestionModel> Questions { get; set; } = null!;
        public DbSet<CheckBoxModel> Checkboxes { get; set; } = null!;
        public DbSet<RangeBoxModel> RangeBoxes { get; set; } = null!;
        public DbSet<TextBoxModel> TextBoxes { get; set; } = null!;

        /// <summary>
        /// Filling out links
        /// </summary>
        public DbSet<CheckBoxLinkModel> CheckboxLinks { get; set; } = null!;
        public DbSet<RangeBoxLinkModel> RangeboxLinks { get; set; } = null!;
        public DbSet<TextBoxLinkModel> TextboxLinks { get; set; } = null!;
        public DbSet<FormLinkModel> FormLinks { get; set; } = null!;
        public DbSet<QuestionLinkModel> QuestionLinks { get; set; } = null!;

        public DatabaseContext() => Database.EnsureCreated();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql("server=localhost;user=root;password=47188475;database=itransition_forms",
                new MySqlServerVersion(new Version(8, 3, 0)),
                mySqlOptions => mySqlOptions.EnableRetryOnFailure());
        }
    }
}