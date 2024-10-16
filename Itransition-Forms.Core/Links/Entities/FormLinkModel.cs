using Itransition_Forms.Core.Links.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("form_links")]
    public class FormLinkModel : UserToEntityLinkBase
    {
        [Column("form_id")] public Guid FormModelId { get; private set; }

        private FormLinkModel() { }

        public FormLinkModel(Guid id, Guid userId, Guid formId) : base(id, userId)
        {
            FormModelId = formId;
        }
    }
}