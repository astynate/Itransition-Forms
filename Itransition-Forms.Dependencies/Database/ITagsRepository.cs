
namespace Itransition_Forms.Database.Repositories
{
    public interface ITagsRepository
    {
        Task<List<string>> GetLastTags();
    }
}