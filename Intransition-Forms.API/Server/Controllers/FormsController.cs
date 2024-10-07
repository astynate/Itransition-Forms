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
        {
            return Ok(await _formsRepository.GetPopularTemplates(6));
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
    }
}