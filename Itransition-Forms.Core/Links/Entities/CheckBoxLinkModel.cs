using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Links.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("checkbox_links")]
    public class CheckBoxLinkModel : AnswerLinkBase
    {
        [Column("is_checked")] public bool IsChecked { get; private set; } = false;

        protected CheckBoxLinkModel(Guid id, Guid answerId, Guid fillingId) : base(id, answerId, fillingId) { }

        public Result<CheckBoxLinkModel> Create(Guid id, Guid answerId, Guid fillingId, bool isChecked)
        {
            return new CheckBoxLinkModel(id, answerId, fillingId)
            {
                IsChecked = isChecked
            };
        }
    }
}