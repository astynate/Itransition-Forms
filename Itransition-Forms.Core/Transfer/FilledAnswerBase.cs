using System.Text.Json;
using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Transfer
{
    public class FilledAnswerBase
    {
        [JsonPropertyName("Id")] public Guid Id { get; set; }
        [JsonPropertyName("answerId")] public Guid AnswerId { get; set; }
        [JsonPropertyName("value")] public JsonElement Value { get; set; }

        [JsonConstructor]
        public FilledAnswerBase(Guid id, Guid answerId, JsonElement value)
        {
            Id = id;
            AnswerId = answerId;
            Value = value;
        }
    }
}