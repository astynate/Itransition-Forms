using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Links.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("checkbox_links")]
    public class CheckBoxLinkModel : AnswerLinkBase
    {
        [Column("value")] public bool Value { get; private set; } = false;

        protected CheckBoxLinkModel(bool value, Guid answerId, Guid formLinkModelId) : base(answerId, formLinkModelId) 
        {
            Value = value;
        }

        public static Result<CheckBoxLinkModel> Create(Guid answerId, Guid formLinkModelId, bool isChecked)
        {
            return new CheckBoxLinkModel(isChecked, answerId, formLinkModelId);
        }
    }
}