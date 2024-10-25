using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Form
{
    [Table("tags")]
    public class TagModel : IEquatable<TagModel>
    {
        [Column("id")][Key] public Guid Id { get; init; } = Guid.NewGuid();
        [Column("form_id")] public Guid FormModelId { get; init; } = Guid.NewGuid();
        [Column("tag")] public string Tag { get; init; } = string.Empty;

        [JsonIgnore] public FormModel? Form { get; init; }

        private TagModel() { }

        [JsonConstructor]
        protected TagModel(Guid formModelId, string tag) 
        {
            if (string.IsNullOrEmpty(tag) || string.IsNullOrWhiteSpace(tag))
                throw new ArgumentNullException(nameof(tag));

            FormModelId = formModelId;
            Tag = tag;
        }

        public bool Equals(TagModel? other) => (other == null) ? false : Id == other.Id;
    }
}