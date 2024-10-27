using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Base
{
    public abstract class AnswerLinkBase
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("answer_id")] public Guid AnswerId { get; private set; }
        [Column("question_id")] public Guid QuestionId { get; private set; }
        [Column("filling_id")] public Guid FormLinkModelId { get; private set; }

        protected AnswerLinkBase() { }

        protected AnswerLinkBase(Guid answerId, Guid formLinkModelId, Guid questionId)
        {
            AnswerId = answerId;
            FormLinkModelId = formLinkModelId;
            QuestionId = questionId;
        }
    }
}