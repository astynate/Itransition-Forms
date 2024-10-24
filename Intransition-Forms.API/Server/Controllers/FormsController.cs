using Itransition_Forms.Core.Form;
using Itransition_Forms.Database.Repositories;
using Itransition_Forms.Dependencies.Database;
using Itransition_Forms.Dependencies.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/forms")]
    public class FormsController : ControllerBase
    {
        private readonly IFormsRepository _formsRepository = null!;

        private readonly IFillingsRepository _fillingsRepository = null!;

        private readonly ITokenService _tokenService = null!;

        public FormsController
        (
            IFormsRepository formsRepository, 
            ITokenService tokenService, 
            IFillingsRepository fillingsRepository
        ) 
        { 
            _formsRepository = formsRepository;
            _tokenService = tokenService;
            _fillingsRepository = fillingsRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetPopularTemplates(string? tag) 
            => Ok(await _formsRepository.GetPopularTemplates(5, tag));

        [HttpGet]
        [Route("/api/forms/{id}")]
        public async Task<IActionResult> GetTemplateById(Guid id)
            => Ok(await _formsRepository.GetFormModelById(id));

        [HttpGet]
        [Route("/api/forms/prefix/{prefix}")]
        public async Task<IActionResult> GetTemplateByPrefix(string prefix)
            => Ok(await _formsRepository.GetFormModelsByPrefix(prefix));

        [HttpGet]
        [Route("/api/forms/latest")]
        public async Task<IActionResult> GetLatestTemplates(int skip, int take)
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(userId) || string.IsNullOrWhiteSpace(userId))
                return Conflict("Owner not found");

            var templates = await _formsRepository
                .GetUsersTemplates(Guid.Parse(userId), skip, take);

            var fillingOuts = await _fillingsRepository
                .GetUserFillingOuts(Guid.Parse(userId), skip, take);

            if (templates.IsFailure)
                return Conflict(templates.Error);

            return Ok(new { templates = templates.Value, fillingOuts });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> NewForm(Guid? templateReference)
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(userId) || string.IsNullOrWhiteSpace(userId))
                return Conflict();

            var form = await _formsRepository.CreateForm(Guid.Parse(userId), templateReference);

            if (form.IsFailure)
                return Conflict(form.Error);

            return Ok(form.Value);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Rename([FromForm] Guid id, [FromForm] string title)
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(userId) || string.IsNullOrWhiteSpace(userId))
                return Conflict();

            var form = await _formsRepository.GetFormModelById(id);

            if (form == null)
                return Conflict("Form not found");

            if (form.UserModelId != Guid.Parse(userId))
                return Conflict("You don't have permission to perform this operation");

            var result = await _formsRepository.UpdateFormTitle(form, title);

            if (result.IsFailure)
                return Conflict(result.Error);

            return Ok(form);
        }

        [HttpPut]
        [Authorize]
        [Route("/api/forms/save")]
        public async Task<IActionResult> Save([FromBody] FormModel model)
        {
            var userid = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(userid) || string.IsNullOrWhiteSpace(userid))
                return Conflict();

            var form = await _formsRepository.GetFormModelById(model.Id);

            if (form == null)
                return BadRequest("form not found");

            if (form.UserModelId != Guid.Parse(userid))
                return Conflict("You don't have permissions to perform this operation");

            var result = await _formsRepository.UpdateForm(form, model);

            if (result.IsFailure)
                return Conflict(result.Error);

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(userId) || string.IsNullOrWhiteSpace(userId))
                return Conflict();

            var result = await _formsRepository.Delete(id, Guid.Parse(userId), true);

            if (result == false)
                return Conflict("Form not found");

            return Ok();
        }
    }
}