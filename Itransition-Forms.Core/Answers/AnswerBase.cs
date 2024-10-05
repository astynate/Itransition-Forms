using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Answers
{
    public class AnswerBase
    {
        [Column("id")] public Guid Id { get; set; } = Guid.NewGuid();
        [Column("question_id")] public Guid QuestionId { get; set; }

        protected AnswerBase(Guid id, Guid questionId) 
        {
            Id = id;
            QuestionId = questionId;
        }
    }
}