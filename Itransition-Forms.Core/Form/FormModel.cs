using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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

        public List<QuestionModel> Questions { get; set; } = [];

        private FormModel() { }

        [JsonConstructor]
        private FormModel
        (
            Guid id,
            string title,
            string description,
            string? imageLink,
            Topics topic,
            string ownerEmail,
            int numberOfFills,
            List<QuestionModel> questions,
            DateTime date
        )
        {
            Id = id;
            Title = title;
            Description = description;
            ImageLink = imageLink;
            Topic = topic;
            OwnerEmail = ownerEmail;
            NumberOfFills = numberOfFills;
            Questions = questions;
            Date = date;
        }

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
                return Result.Failure("Form Title is a required field");

            Title = title; return Result.Success();
        }

        public Result CopyParams(FormModel form)
        {
            if (string.IsNullOrEmpty(form.Title) || string.IsNullOrWhiteSpace(form.Title))
                return Result.Failure("Title is required");

            if (form.Id != Id)
                return Result.Failure("Form not found");

            if (form.Questions == null)
                return Result.Failure("Questions cannot be null");

            Title = form.Title;
            Description = form.Description;
            ImageLink = form.ImageLink;
            Topic = form.Topic;

            return Result.Success();
        }
    }
}