using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Answers
{
    public class AnswerBase
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("question_id")] public Guid QuestionModelId { get; private set; }

        protected AnswerBase() { }

        protected AnswerBase(Guid id, Guid questionId) 
        {
            Id = id;
            QuestionModelId = questionId;
        }
    }
}