using Itransition_Forms.Core.Answers;
using Itransition_Forms.Core.Form;
using Itransition_Forms.Core.Links.Base;
using Itransition_Forms.Core.Links.Entities;
using Itransition_Forms.Core.User;
using Microsoft.EntityFrameworkCore;

namespace Itransition_Forms.Database.Contexts
{
    public class DatabaseContext : DbContext
    {
        public DbSet<UserModel> Users { get; set; } = null!;
        public DbSet<FormModel> Forms { get; set; } = null!;
        public DbSet<QuestionModel> Questions { get; set; } = null!;
        public DbSet<TagModel> Tags { get; set; } = null!;
        public DbSet<CheckBoxModel> Checkboxes { get; set; } = null!;
        public DbSet<RangeBoxModel> RangeBoxes { get; set; } = null!;
        public DbSet<TextBoxModel> TextBoxes { get; set; } = null!;
        public DbSet<CheckBoxLinkModel> CheckboxLinks { get; set; } = null!;
        public DbSet<RangeBoxLinkModel> RangeLinks { get; set; } = null!;
        public DbSet<TextBoxLinkModel> TextboxLinks { get; set; } = null!;
        public DbSet<FormLinkModel> FormLinks { get; set; } = null!;

        public DatabaseContext(DbContextOptions options) : base(options) => Database.EnsureCreated();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FormModel>().HasMany(s => s.Questions);
            modelBuilder.Entity<FormModel>().HasMany(s => s.Tags);
            modelBuilder.Entity<FormModel>().HasOne(s => s.Owner);

            modelBuilder.Entity<QuestionModel>().HasMany(s => s.Answers);
            modelBuilder.Entity<TagModel>().HasOne(s => s.Form);

            modelBuilder.Entity<FormLinkModel>().HasMany(x => x.Answers);
            modelBuilder.Entity<FormLinkModel>().HasOne(x => x.User);
            modelBuilder.Entity<FormLinkModel>().HasOne(x => x.Form);

            modelBuilder.Entity<AnswerBase>().UseTpcMappingStrategy();
            modelBuilder.Entity<AnswerLinkBase>().UseTpcMappingStrategy();
        }
    }
}