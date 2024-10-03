using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Answers
{
    [Table("range")]
    public class RangeModel
    {
        public uint Range { get; set; }
    }
}