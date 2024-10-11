using Itransition_Forms.Database;
using Itransition_Forms.Dependencies.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/forms")]
    public class FormsController : ControllerBase
    {
        private readonly IFormsRepository _formsRepository;

        private readonly ITokenService _tokenService;

        public FormsController(IFormsRepository formsRepository, ITokenService tokenService) 
        { 
            _formsRepository = formsRepository;
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPopularTemplates() 
            => Ok(await _formsRepository.GetPopularTemplates(5));

        [HttpGet]
        [Route("/api/forms/{id}")]
        public async Task<IActionResult> GetTemplateById(Guid id)
            => Ok(await _formsRepository.GetFormModelById(id));

        [HttpGet]
        [Route("/api/forms/latest")]
        public async Task<IActionResult> GetLatestTemplates(int skip, int take)
        {
            var email = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(email) || string.IsNullOrWhiteSpace(email))
                return Unauthorized("User not found");

            var templates = await _formsRepository.GetUsersTemplates(email, skip, take);

            if (templates.IsFailure)
                return Conflict(templates.Error);

            return Ok(templates.Value);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> NewForm(Guid? templateReference)
        {
            var email = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(email) || string.IsNullOrWhiteSpace(email))
                return Unauthorized();

            var form = await _formsRepository.CreateForm(email);

            if (form.IsFailure)
                return Conflict(form.Error);

            return Ok(form.Value);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> Rename([FromForm] Guid id, [FromForm] string title)
        {
            var email = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(email) || string.IsNullOrWhiteSpace(email))
                return Unauthorized();

            var form = await _formsRepository.GetFormModelById(id);

            if (form == null)
                return Conflict("Form not found");

            if (form.OwnerEmail != email)
                return Conflict("You don't have permission to perform this operation");

            var result = await _formsRepository.UpdateFormTitle(form, title);

            if (result.IsFailure)
                return Conflict(result.Error);

            return Ok(form);
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var email = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(email) || string.IsNullOrWhiteSpace(email))
                return Unauthorized();

            var result = await _formsRepository.Delete(id, email, true);

            if (result == false)
                return Conflict("Form not found");

            return Ok();
        }
    }
}