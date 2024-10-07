using Itransition_Forms.Core.Links.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("form_links")]
    public class FormLinkModel : UserToEntityLinkBase
    {
        [Column("form_id")] public Guid FormId { get; private set; }

        public FormLinkModel(Guid id, string userEmail, Guid formId) : base(id, userEmail)
        {
            FormId = formId;
        }
    }
}