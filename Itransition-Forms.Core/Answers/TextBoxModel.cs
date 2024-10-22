using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Answers
{
    [Table("textboxes")]
    public class TextBoxModel : AnswerBase
    {
        [Column("is_multiple")]
        [JsonPropertyName("isMultiple")] 
        public bool IsMultiple { get; private set; } = false;

        private TextBoxModel() : base() { }

        [JsonConstructor]
        protected TextBoxModel(Guid id, Guid questionModelId, bool isMultiple, int index) : base(id, questionModelId, index)
        {
            IsMultiple = isMultiple;
        }

        protected TextBoxModel(Guid id, Guid questionId, int index) : base(id, questionId, index) { }

        public static Result<TextBoxModel> Create(Guid id, Guid questionId, bool isMultiple, int index)
        {
            return new TextBoxModel(id, questionId, index)
            { 
                IsMultiple = isMultiple
            };
        }

        public override void Clone(AnswerBase obj)
        {
            base.Clone(obj);

            if (obj is TextBoxModel)
            {
                var textBoxModel = (TextBoxModel)obj;

                IsMultiple = textBoxModel.IsMultiple;
            }
        }

        public override AnswerBase Clone(Guid questionId)
        {
            return new TextBoxModel(Guid.NewGuid(), questionId, Index)
            {
                IsMultiple = IsMultiple
            };
        }
    }
}