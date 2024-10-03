using System.ComponentModel.DataAnnotations.Schema;

namespace Itransition_Forms.Core.Answers
{
    [Table("checkboxes")]
    public class CheckBox
    {
        public string Text { get; set; } = string.Empty;
        public bool IsChecked { get; set; }
    }
}