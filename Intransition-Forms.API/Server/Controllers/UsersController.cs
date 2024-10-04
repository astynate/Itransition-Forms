using Itransition_Form.Services;
using Itransition_Forms.Dependencies.Database;
using Itransition_Forms.Dependencies.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _userRepository;

        private readonly ITokenService _tokenService;

        public UsersController(IUsersRepository usersRepository, ITokenService tokenService)
        {
            _userRepository = usersRepository;
            _tokenService = tokenService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUser()
        {
            var bearer = Request.Headers["Authentication"].FirstOrDefault();

            if (bearer == null || bearer.Split(" ").Length > 1)
                return Unauthorized();

            var email = _tokenService
                .GetClaimFromToken(bearer.Split(" ")[2], "email");

            await _userRepository.G

            Ok();
        }

        [HttpPost]
        [Route("/api/users/register")]
        public async Task<IActionResult> Register([FromForm] string email, [FromForm] string password, [FromForm] int color)
        {
            var result = await _userRepository.Register(email, password, color);

            if (result.IsFailure)
                return BadRequest(result.Error);

            Response.Headers["Access-Token"] = _tokenService
                .GenerateAccessToken(result.Value);

            return Ok(result.Value);
        }

        [HttpPost]
        [Route("/api/users/login")]
        public async Task<IActionResult> Login([FromForm] string email, [FromForm] string password, [FromForm] int color)
        {
            var result = await _userRepository.Login(email, password);

            if (result.IsFailure)
                return BadRequest(result.Error);

            Response.Headers["Access-Token"] = _tokenService
                .GenerateAccessToken(result.Value);

            return Ok(result.Value);
        }
    }
}