using Itransition_Forms.Core.Links.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("form_links")]
    public class FormLinkModel : UserToEntityLinkBase
    {
        [Column("form_id")] public Guid FormModelId { get; private set; }
        [Column("date")] public DateTime Date { get; private set; } = DateTime.Now;

        private FormLinkModel() { }

        public FormLinkModel(Guid userId, Guid formId) : base(userId)
        {
            FormModelId = formId;
        }
    }
}