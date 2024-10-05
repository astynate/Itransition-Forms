using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Base
{
    public abstract class AnswerLinkBase
    {
        [Column("id")] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("answer_id")] public Guid AnswerId { get; private set; }

        private AnswerLinkBase() { }

        protected AnswerLinkBase(Guid id, Guid answerId)
        {
            Id = id;
            AnswerId = answerId;
        }
    }
}