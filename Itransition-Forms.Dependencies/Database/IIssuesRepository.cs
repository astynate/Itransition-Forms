
using Itransition_Forms.Core.Jira;

namespace Itransition_Forms.Database.Repositories
{
    public interface IIssuesRepository
    {
        Task<IssueModel> AddAsync
        (
            string id,
            string title,
            string description,
            string link,
            string priority,
            string key,
            string self,
            Guid userModelId
        );

        Task<IssueModel[]> GetUserIssues(Guid userId);
    }
}