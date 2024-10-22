using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Answers
{
    [Table("range")]
    public class RangeBoxModel : AnswerBase
    {
        [Column("max_value")][JsonPropertyName("maxValue")] public uint MaxValue { get; private set; } = uint.MaxValue;
        [Column("min_value")][JsonPropertyName("minValue")] public uint MinValue { get; private set; } = uint.MinValue;

        private RangeBoxModel() : base() { }

        [JsonConstructor]
        protected RangeBoxModel(Guid id, Guid questionModelId, uint maxValue, uint minValue, int index) : base(id, questionModelId, index)
        {
            MaxValue = maxValue;
            MinValue = minValue;
        }

        protected RangeBoxModel(Guid id, Guid questionId, int index) : base(id, questionId, index) { }

        public static Result<RangeBoxModel> Create(Guid id, Guid questionId, uint minValue, uint maxValue, int index)
        {
            minValue = Math.Max(uint.MinValue, minValue);
            maxValue = Math.Min(uint.MaxValue, maxValue);

            return new RangeBoxModel(id, questionId, index) 
            { 
                MinValue = minValue,
                MaxValue = maxValue
            };
        }

        public override void Clone(AnswerBase obj)
        {
            base.Clone(obj);

            if (obj is RangeBoxModel)
            {
                var rangeBoxModel = (RangeBoxModel)obj;

                MaxValue = rangeBoxModel.MaxValue;
                MinValue = rangeBoxModel.MinValue;
            }
        }

        public override AnswerBase Clone(Guid questionId)
        {
            return new RangeBoxModel(Guid.NewGuid(), questionId, Index)
            {
                MaxValue = MaxValue, 
                MinValue = MinValue
            };
        }
    }
}