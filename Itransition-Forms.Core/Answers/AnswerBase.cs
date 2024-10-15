using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Answers
{
    public abstract class AnswerBase
    {
        [Column("id")][JsonPropertyName("id")][Key] public Guid Id { get; private set; } = Guid.NewGuid();
        [Column("index")][JsonPropertyName("index")] public int Index { get; private set; } = 0;
        [Column("question_id")][JsonPropertyName("questionModelId")] public Guid QuestionModelId { get; private set; }

        protected AnswerBase() { }

        public AnswerBase(Guid id, Guid questionModelId, int index) 
        {
            Id = id;
            QuestionModelId = questionModelId;
            Index = index;
        }

        public virtual void Clone(AnswerBase obj)
        {
            Index = obj.Index;
        }
    }
}