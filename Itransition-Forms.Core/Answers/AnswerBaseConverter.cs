using System.Text.Json.Serialization;
using System.Text.Json;

namespace Itransition_Forms.Core.Answers
{
    public class AnswerBaseConverter : JsonConverter<AnswerBase>
    {
        private delegate AnswerBase? DeserializeDelegate(JsonElement json);

        public override AnswerBase Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            using (JsonDocument doc = JsonDocument.ParseValue(ref reader))
            {
                var root = doc.RootElement;

                object? title = root.TryGetProperty("title", out var titleProperty) ? titleProperty.GetString() : null;
                object? minValue = root.TryGetProperty("minValue", out var minValueProperty) ? minValueProperty.GetInt64() : -1;
                object? isMultiple = root.TryGetProperty("isMultiple", out var isMultipleProperty) ? isMultipleProperty.GetBoolean() : null;

                AnswerBase result = CheckBoxModel.GetDefaultCheckbox();

                Dictionary<DeserializeDelegate, bool> types = new Dictionary<DeserializeDelegate, bool>()
                {
                    { DeserializeCheckBoxModel, title != null },
                    { DeserializeRangeBoxModel, minValue != null },
                    { DeserializeTextBoxModel, isMultiple != null },
                };

                foreach (var type in types)
                {
                    if (type.Value == true)
                    {
                        var resultObject = type.Key(root);

                        if (resultObject != null)
                        {
                            result = resultObject;
                        }
                    }
                }

                return result;
            }
        }

        private CheckBoxModel? DeserializeCheckBoxModel(JsonElement element)
            => JsonSerializer.Deserialize<CheckBoxModel>(element);

        private RangeBoxModel? DeserializeRangeBoxModel(JsonElement element)
            => JsonSerializer.Deserialize<RangeBoxModel>(element);

        private TextBoxModel? DeserializeTextBoxModel(JsonElement element)
            => JsonSerializer.Deserialize<TextBoxModel>(element);

        public override void Write(Utf8JsonWriter writer, AnswerBase value, JsonSerializerOptions options) 
            => JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }
}