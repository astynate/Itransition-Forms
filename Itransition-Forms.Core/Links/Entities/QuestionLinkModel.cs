using Itransition_Forms.Core.Links.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Links.Entities
{
    [Table("question_links")]
    public class QuestionLinkModel : UserToEnitityLinkBase
    {
        [Column("question_id")] public Guid QuestionId { get; init; }

        public QuestionLinkModel(Guid id, string userEmail, Guid questionId) : base(id, userEmail) 
        {
            QuestionId = questionId;
        }
    }
}