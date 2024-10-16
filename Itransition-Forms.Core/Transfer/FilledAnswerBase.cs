using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Transfer
{
    public class FilledAnswerBase
    {
        [JsonPropertyName("id")] public Guid Id { get; set; }
        [JsonPropertyName("answerId")] public Guid AnswerId { get; set; }
        [JsonPropertyName("value")] public object Value { get; set; } = null!;

        [JsonConstructor]
        public FilledAnswerBase(Guid id, Guid answerId, object value)
        {
            Id = id;
            AnswerId = answerId;
            Value = value;
        }
    }
}