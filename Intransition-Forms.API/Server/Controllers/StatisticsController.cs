using Itransition_Forms.Database.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/statistics")]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticRepository _statisticRepository;

        public StatisticsController(IStatisticRepository statisticRepository) 
        { 
            _statisticRepository = statisticRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetStatistic(Guid formId) 
            => Ok(await _statisticRepository.GetQuestionStatistic(formId));
    }
}