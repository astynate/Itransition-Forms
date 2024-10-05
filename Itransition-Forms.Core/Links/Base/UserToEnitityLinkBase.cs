using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Base
{
    public abstract class UserToEnitityLinkBase
    {
        [Column("id")] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("user_email")] public string UserEmail { get; private set; } = string.Empty;

        private UserToEnitityLinkBase() { }

        protected UserToEnitityLinkBase(Guid id, string userEmail)
        {
            Id = id;
            UserEmail = userEmail;
        }
    }
}