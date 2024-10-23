using Itransition_Form.Services;
using Itransition_Forms.Core.Transfer;
using Itransition_Forms.Database.Repositories;
using Itransition_Forms.Dependencies.Database;
using Itransition_Forms.Dependencies.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/fillings")]
    public class FillingsController : ControllerBase
    {
        private readonly IFillingsRepository _fillingRepository;

        private readonly IFormsRepository _formsRepository;

        private readonly ISerializationHelper _serializationHelper;

        private readonly ITokenService _tokenService;

        public FillingsController
        (
            IFillingsRepository fillingRepository, 
            ITokenService tokenService, 
            IFormsRepository formsRepository, 
            ISerializationHelper serializationHelper
        )
        {
            _fillingRepository = fillingRepository;
            _tokenService = tokenService;
            _formsRepository = formsRepository;
            _serializationHelper = serializationHelper;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get(Guid id, int from)
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");

            if (userId == null)
                return Conflict();

            var form = await _formsRepository.GetFormModelById(id);

            if (form == null) 
                return Conflict("Form not found");

            if (form.UserModelId != Guid.Parse(userId))
                return Conflict("You don't have access to filling outs.");

            var result = await _fillingRepository
                .GetByFormId(form.Id, from, 5);

            return Ok(_serializationHelper.SerializeWithCamelCase(result));
        }

        [HttpPost]
        [Authorize]
        [Route("/api/fillings/{id}")]
        public async Task<IActionResult> FillOutForm(Guid id, [FromBody] FilledAnswerBase[] answers)
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");

            if (userId == null)
                return Conflict();

            var result = await _fillingRepository.Create(Guid.Parse(userId), id, answers);

            if (result.IsFailure)
                return Conflict(result.Error);

            return Ok();
        }
    }
}