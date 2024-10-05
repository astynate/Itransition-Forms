using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Answers
{
    [Table("checkboxes")]
    public class CheckBoxModel : AnswerBase
    {
        [Column("title")] public string Title { get; set; } = string.Empty;
        [Column("default_value")] public bool DefaultValue { get; set; } = false;

        protected CheckBoxModel(Guid id, Guid questionId) : base(id, questionId) { }

        public static Result<CheckBoxModel> Create(Guid id, Guid questionId, string title, bool isChecked)
        {
            if (string.IsNullOrEmpty(title) || string.IsNullOrWhiteSpace(title))
                return Result.Failure<CheckBoxModel>("Title is required");

            if (title.Length > 50)
                return Result.Failure<CheckBoxModel>("The title max length is 50 symbols");

            return new CheckBoxModel(id, questionId)
            {
                Title = title,
                DefaultValue = isChecked
            };
        }
    }
}