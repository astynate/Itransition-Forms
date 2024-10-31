using System.Diagnostics.CodeAnalysis;

namespace Itransition_Forms.Core.Abstract
{
    public class DatabaseModelComparrer : IEqualityComparer<DatabaseModel>
    {
        public bool Equals(DatabaseModel? x, DatabaseModel? y)
        {
            if (x == null || y == null)
            {
                return false;
            };

            return x.Id.GetHashCode() == y.Id.GetHashCode();
        }

        public int GetHashCode([DisallowNull] DatabaseModel obj)
        {
            return obj.Id.GetHashCode();
        }
    }
}