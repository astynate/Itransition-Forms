using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Answers;
using Itransition_Forms.Core.Links.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("rangebox_links")]
    public class RangeBoxLinkModel : AnswerLinkBase
    {
        [Column("value")] public uint Value { get; private set; } = 0;

        protected RangeBoxLinkModel(Guid id, Guid answerId) : base(id, answerId) { }

        public static Result<RangeBoxLinkModel> Create(RangeBoxModel validationModel, Guid id, Guid answerId, uint value)
        {
            return new RangeBoxLinkModel(id, answerId)
            {
                Value = Math.Max(Math.Min(value, validationModel.MaxValue),
                    validationModel.MinValue)
            };
        }
    }
}