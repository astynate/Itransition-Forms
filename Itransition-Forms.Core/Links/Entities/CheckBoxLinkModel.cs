using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Links.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("checkbox_links")]
    public class CheckBoxLinkModel : AnswerLinkBase
    {
        [Column("is_checked")] public bool IsChecked { get; private set; } = false;

        protected CheckBoxLinkModel(Guid id, Guid answerId) : base(id, answerId) { }

        public Result<CheckBoxLinkModel> Create(Guid id, Guid answerId, bool isChecked)
        {
            return new CheckBoxLinkModel(id, answerId)
            {
                IsChecked = isChecked
            };
        }
    }
}