using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Account
{
    [Table("form_user_access")]
    public class FormModelUserModel
    {
        [Column("Id")][Key] public Guid Id { get; init; } = Guid.NewGuid();
        [Column("user_id")] public Guid UserModelId { get; private set; }
        [Column("form_id")] public Guid FormsId { get; private set; }

        private FormModelUserModel() { }

        public FormModelUserModel(Guid userModelId, Guid formModelId)
        {
            UserModelId = userModelId;
            FormsId = formModelId;
        }
    }
}