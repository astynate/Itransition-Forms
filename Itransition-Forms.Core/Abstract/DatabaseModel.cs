using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Abstract
{
    public abstract class DatabaseModel : IEquatable<DatabaseModel>
    {
        [Column("id")][JsonPropertyName("id")][Key] public Guid Id { get; init; } = Guid.NewGuid();

        public override int GetHashCode() => Id.GetHashCode();
        public bool Equals(DatabaseModel? other) => other == null ? false : other.Id.GetHashCode() == Id.GetHashCode();
    }
}