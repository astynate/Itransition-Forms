using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Answers;
using Itransition_Forms.Core.Links.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("textbox_links")]
    public class TextBoxLinkModel : AnswerLinkBase
    {
        [Column("text")] public string Text { get; set; } = string.Empty;

        protected TextBoxLinkModel(Guid id, Guid answerId, Guid fillingId) : base(id, answerId, fillingId) { }

        public static Result<TextBoxLinkModel> Create(Guid id, Guid answerId, Guid fillingId, TextBoxModel validationModel, string text)
        {
            int maxLength = validationModel.IsMultiple ? 400: 100;

            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
                return Result.Failure<TextBoxLinkModel>("Text field is required");

            if (text.Length > maxLength)
                return Result.Failure<TextBoxLinkModel>($"The max length of text is {maxLength}");

            return new TextBoxLinkModel(id, answerId, fillingId)
            {
                Text = text
            };
        }
    }
}