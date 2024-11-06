using Itransition_Forms.Core.Jira;
using Itransition_Forms.Database.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Itransition_Forms.Database.Repositories
{
    public class IssuesRepository : IIssuesRepository
    {
        private readonly DatabaseContext _context;

        public IssuesRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IssueModel> AddAsync
        (
            string id,
            string title,
            string description,
            string link,
            string priority,
            string key,
            string self,
            Guid userModelId
        )
        {
            IssueModel issue = new IssueModel(
                id,
                title,
                description,
                link,
                priority,
                key,
                self,
                userModelId
            );

            await _context.AddAsync(issue);
            await _context.SaveChangesAsync();

            return issue;
        }

        public async Task<IssueModel[]> GetUserIssues(Guid userId) 
            => await _context.Issues.Where(x => x.UserModelId == userId).ToArrayAsync();
    }
}