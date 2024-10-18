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

        protected RangeBoxLinkModel(Guid answerId, Guid formLinkModelId, uint value) : base(answerId, formLinkModelId) 
        {
            Value = value;
        }

        public static Result<RangeBoxLinkModel> Create(RangeBoxModel? validationModel, Guid answerId, Guid formLinkModelId, uint value)
        {
            if (validationModel == null)
                return Result.Failure<RangeBoxLinkModel>("Validation model not found");

            value = Math.Max(Math.Min(value, validationModel.MaxValue), 
                validationModel.MinValue);

            return new RangeBoxLinkModel(answerId, formLinkModelId, value);
        }
    }
}