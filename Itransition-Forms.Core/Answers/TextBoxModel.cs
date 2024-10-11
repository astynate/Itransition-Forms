
using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Answers
{
    [Table("textboxes")]
    public class TextBoxModel : AnswerBase
    {
        [Column("is_multiple")] public bool IsMultiple { get; private set; } = false;

        private TextBoxModel() : base() { }

        protected TextBoxModel(Guid id, Guid questionId) : base(id, questionId) { }

        public static Result<TextBoxModel> Create(Guid id, Guid questionId, bool isMultiple)
        {
            return new TextBoxModel(id, questionId)
            { 
                IsMultiple = isMultiple
            };
        }
    }
}