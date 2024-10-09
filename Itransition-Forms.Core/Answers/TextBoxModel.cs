
using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Answers
{
    [Table("textboxes")]
    public class TextBoxModel : AnswerBase
    {
        [Column("is_multiple")] public bool IsMultiple { get; private set; } = false;
        [Column("text")] public string Text { get; private set; } = string.Empty;

        private TextBoxModel() : base() { }

        protected TextBoxModel(Guid id, Guid questionId) : base(id, questionId) { }

        public static Result<TextBoxModel> Create(Guid id, Guid questionId, string text, bool isMultiple)
        {
            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
            {
                return Result.Failure<TextBoxModel>("Title is requiered");
            }

            return new TextBoxModel(id, questionId)
            { 
                Text = text,
                IsMultiple = isMultiple
            };
        }
    }
}