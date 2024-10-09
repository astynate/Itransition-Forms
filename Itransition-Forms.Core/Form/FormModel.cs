using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Form
{
    [Table("forms")]
    public class FormModel
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("title")] public string Title { get; private set; } = string.Empty;
        [Column("description")] public string Description { get; private set; } = string.Empty;
        [Column("image_link")] public string? ImageLink { get; private set; } = null;
        [Column("topics")] public Topics Topic { get; private set; } = Topics.Other;
        [Column("owner")] public string OwnerEmail { get; private set; } = string.Empty;
        [Column("number_of_fills")] public int NumberOfFills { get; private set; } = 0;
        [Column("date")] public DateTime Date { get; private set; } = DateTime.Now;

        [NotMapped] public List<QuestionModel> Questions { get; set; } = [];

        private FormModel() { }

        public static Result<FormModel> Create(string title, string description, Topics topic, string ownerEmail)
        {
            if (string.IsNullOrEmpty(title) || string.IsNullOrEmpty(title))
                return Result.Failure<FormModel>("Title is required");

            return new FormModel()
            {
                Title = title,
                Description = description,
                Topic = topic,
                OwnerEmail = ownerEmail
            };
        }

        public void IncrementNumberOfFills() => NumberOfFills++;

        public Result UpdateTitle(string title)
        {
            if (string.IsNullOrEmpty(title) || string.IsNullOrWhiteSpace(title))
                return Result.Failure("Form title is a required field");

            Title = title; return Result.Success();
        }
    }
}