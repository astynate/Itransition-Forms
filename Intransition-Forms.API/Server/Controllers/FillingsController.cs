using Itransition_Forms.Core.Transfer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/fillings")]
    public class FillingsController : ControllerBase
    {
        [HttpPost]
        [Authorize]
        [Route("/api/fillings/{id}")]
        public async Task<IActionResult> FillOutForm(Guid id, [FromBody] FilledAnswerBase[] answers)
        {


            return Ok();
        }
    }
}