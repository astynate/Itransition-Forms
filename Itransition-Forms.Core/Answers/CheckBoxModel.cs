using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Answers
{
    [Table("checkboxes")]
    public class CheckBoxModel : AnswerBase
    {
        [Column("title")][JsonPropertyName("title")] public string Title { get; set; } = string.Empty;
        [Column("default_value")][JsonPropertyName("defaultValue")] public bool DefaultValue { get; set; } = false;

        private CheckBoxModel() : base() { }

        [JsonConstructor]
        public CheckBoxModel(Guid id, Guid questionModelId, string title, bool defaultValue, int index) : base(id, questionModelId, index)
        {
            Title = title;
            DefaultValue = defaultValue;
        }

        protected CheckBoxModel(Guid id, Guid questionId, int index) : base(id, questionId, index) { }

        public static Result<CheckBoxModel> Create(Guid id, Guid questionId, string title, bool isChecked, int index)
        {
            if (string.IsNullOrEmpty(title) || string.IsNullOrWhiteSpace(title))
                return Result.Failure<CheckBoxModel>("Title is required");

            if (title.Length > 50)
                return Result.Failure<CheckBoxModel>("The Title max length is 50 symbols");

            return new CheckBoxModel(id, questionId, 0)
            {
                Title = title,
                DefaultValue = isChecked
            };
        }

        public override void Clone(AnswerBase obj)
        {
            base.Clone(obj);

            if (obj is CheckBoxModel)
            {
                var checkBoxModel = (CheckBoxModel)obj;

                Title = checkBoxModel.Title;
                DefaultValue = checkBoxModel.DefaultValue;
            }
        }

        public static CheckBoxModel GetDefaultCheckbox()
        {
            return new CheckBoxModel(Guid.NewGuid(), Guid.Empty, 0)
            {
                Title = string.Empty,
                DefaultValue = false
            };
        }

        public override AnswerBase Clone(Guid questionId)
        {
            return new CheckBoxModel(Guid.NewGuid(), questionId, Index)
            {
                Title = Title,
                DefaultValue = DefaultValue
            };
        }
    }
}