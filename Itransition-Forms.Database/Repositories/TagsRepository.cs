using Itransition_Forms.Database.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Itransition_Forms.Database.Repositories
{
    public class TagsRepository : ITagsRepository
    {
        private readonly DatabaseContext _context;

        public TagsRepository(DatabaseContext context)
        {
            _context = context;
        }
        public async Task<List<string>> GetLastTags()
        {
            return await _context.Tags
                .OrderByDescending(x => x.Tag)
                .Take(5)
                .Select(x => x.Tag)
                .ToListAsync();
        }

        public async Task<List<string>> GetTagsByPrefix(string prefix)
        {
            return await _context.Tags
                .Where(x => x.Tag.StartsWith(prefix))
                .Select(x => x.Tag)
                .Distinct()
                .OrderByDescending(x => x)
                .Take(5)
                .ToListAsync();
        }
    }
}