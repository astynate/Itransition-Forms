using CSharpFunctionalExtensions;
using Itransition_Forms.Core.User;
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
        [Column("access_type")] public AccessTypes AccessType { get; private set; } = AccessTypes.Public;
        [Column("owner")] public Guid UserModelId { get; private set; } = Guid.Empty;
        [Column("number_of_fills")] public int NumberOfFills { get; private set; } = 0;
        [Column("date")] public DateTime Date { get; private set; } = DateTime.Now;

        public List<QuestionModel> Questions { get; set; } = [];
        public List<UserModel> UsersWithFillingOutAccess { get; set; } = [];
        public List<TagModel> Tags { get; set; } = [];
        public UserModel? Owner { get; set; }

        [NotMapped]
        [JsonIgnore]
        [ConcurrencyCheck]
        public Guid RowVersion { get; set; } = Guid.NewGuid();

        private FormModel() { }

        [JsonConstructor]
        private FormModel
        (
            Guid id,
            string title,
            string description,
            string? imageLink,
            Topics topic,
            AccessTypes accessType,
            Guid userModelId,
            int numberOfFills,
            List<QuestionModel> questions,
            List<TagModel> tags,
            List<UserModel> usersWithFillingOutAccess,
            UserModel? owner,
            DateTime date
        )
        {
            Id = id;
            Title = title;
            Description = description;
            ImageLink = imageLink;
            Topic = topic;
            AccessType = accessType;
            UserModelId = userModelId;
            NumberOfFills = numberOfFills;
            Questions = questions;
            Owner = owner;
            Date = date;
            Tags = tags;

            UsersWithFillingOutAccess = accessType == AccessTypes.SelectedUsers ?
                usersWithFillingOutAccess.Take(7).ToList() : [];
        }

        public static Result<FormModel> Create(string title, string description, Topics topic, Guid ownerId)
        {
            if (string.IsNullOrEmpty(title) || string.IsNullOrEmpty(title))
                return Result.Failure<FormModel>("Title is required");

            return new FormModel()
            {
                Title = title,
                Description = description,
                Topic = topic,
                UserModelId = ownerId
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
            AccessType = form.AccessType;
            RowVersion = Guid.NewGuid();

            return Result.Success();
        }

        public void SortQuestionsByIndex()
        {
            Questions = Questions
                .OrderBy(x => x.Index).ToList();

            foreach(var question in Questions)
            {
                question.SortAnswersByIndex();
            }
        }

        public FormModel Clone()
        {
            return new FormModel
            {
                Id = Guid.NewGuid(),
                Title = Title,
                Description = Description,
                ImageLink = ImageLink,
                Topic = Topic,
                UserModelId = UserModelId,
                NumberOfFills = NumberOfFills,
                Questions = Questions.Select(e => e.Clone()).ToList(),
                Owner = Owner,
                Date = DateTime.Now
            };
        }
    }
}