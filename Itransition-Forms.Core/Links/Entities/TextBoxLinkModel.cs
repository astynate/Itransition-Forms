using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Answers;
using Itransition_Forms.Core.Links.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("textbox_links")]
    public class TextBoxLinkModel : AnswerLinkBase
    {
        [Column("value")] public string Value { get; set; } = string.Empty;

        protected TextBoxLinkModel(string value, Guid answerId, Guid formLinkModelId) : base(answerId, formLinkModelId) 
        {
            Value = value;
        }

        public static Result<TextBoxLinkModel> Create(Guid answerId, Guid formLinkModelId, TextBoxModel? validationModel, string? text)
        {
            if (validationModel == null)
                return Result.Failure<TextBoxLinkModel>("Validation model is not found");

            int maxLength = validationModel.IsMultiple ? 400: 100;

            if (string.IsNullOrEmpty(text) || string.IsNullOrWhiteSpace(text))
                return Result.Failure<TextBoxLinkModel>("Value field is required");

            if (text.Length > maxLength)
                return Result.Failure<TextBoxLinkModel>($"The max length of value is {maxLength}");

            return new TextBoxLinkModel(text, answerId, formLinkModelId);
        }
    }
}