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
                .OrderByDescending(x => x.Id)
                .Take(5)
                .Select(x => x.Tag)
                .ToListAsync();
        }
    }
}