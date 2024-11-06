using Itransition_Forms.Core.Form;
using Itransition_Forms.Core.Links.Base;
using Itransition_Forms.Core.User;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("form_links")]
    public class FormLinkModel
    {
        [Column("Id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("user_id")] public Guid UserModelId { get; private set; } = Guid.Empty;
        [Column("form_id")] public Guid FormModelId { get; private set; }
        [Column("date")] public DateTime Date { get; private set; } = DateTime.Now;

        public List<AnswerLinkBase> Answers { get; set; } = [];
        public UserModel? User { get; set; }
        public FormModel? Form { get; set; }

        private FormLinkModel() { }

        public FormLinkModel(Guid userId, Guid formId)
        {
            UserModelId = userId;
            FormModelId = formId;
        }
    }
}