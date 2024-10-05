using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Answers
{
    [Table("range")]
    public class RangeBoxModel : AnswerBase
    {
        [Column("max_value")] public uint MaxValue { get; private set; } = uint.MaxValue;
        [Column("min_value")] public uint MinValue { get; private set; } = uint.MinValue;

        protected RangeBoxModel(Guid id, Guid questionId) : base(id, questionId) { }

        public static Result<RangeBoxModel> Create(Guid id, Guid questionId, uint minValue, uint maxValue)
        {
            minValue = Math.Max(uint.MinValue, minValue);
            maxValue = Math.Min(uint.MaxValue, maxValue);

            return new RangeBoxModel(id, questionId) 
            { 
                MinValue = minValue,
                MaxValue = maxValue
            };
        }
    }
}