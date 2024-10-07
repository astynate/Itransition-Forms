using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Base
{
    public abstract class UserToEntityLinkBase
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("user_email")] public string UserEmail { get; private set; } = string.Empty;

        private UserToEntityLinkBase() { }

        protected UserToEntityLinkBase(Guid id, string userEmail)
        {
            Id = id;
            UserEmail = userEmail;
        }
    }
}