using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Base
{
    public abstract class AnswerLinkBase
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("answer_id")] public Guid AnswerId { get; private set; }
        [Column("filling_id")] public Guid FillingId { get; private set; }

        private AnswerLinkBase() { }

        protected AnswerLinkBase(Guid id, Guid answerId, Guid fillingId)
        {
            Id = id;
            AnswerId = answerId;
            FillingId = fillingId;
        }
    }
}