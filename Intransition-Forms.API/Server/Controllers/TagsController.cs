using Itransition_Forms.Database.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/tags")]
    public class TagsController : ControllerBase
    {
        private readonly ITagsRepository _tagsRepository;

        public TagsController(ITagsRepository tagsRepository)
        {
            _tagsRepository = tagsRepository;
        }

        [HttpGet] 
        public async Task<IActionResult> Get() 
            => Ok(await _tagsRepository.GetLastTags());

        [HttpGet]
        [Route("/api/tags/prefix")] 
        public async Task<IActionResult> Get(string prefix) 
            => Ok(await _tagsRepository.GetTagsByPrefix(prefix));
    }
}