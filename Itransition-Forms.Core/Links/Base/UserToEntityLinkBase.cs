using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Base
{
    public abstract class UserToEntityLinkBase
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("user_id")] public Guid UserModelId { get; private set; } = Guid.Empty;

        protected UserToEntityLinkBase() { }

        protected UserToEntityLinkBase(Guid userModelId)
        {
            UserModelId = userModelId;
        }
    }
}