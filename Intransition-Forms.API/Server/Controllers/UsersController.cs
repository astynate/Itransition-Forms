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

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            var email = _tokenService.GetClaimFromRequest(Request, "sub");
            var user = await _userRepository.GetUserByEmail(email ?? "");

            if (user == null)
                return Unauthorized();

            Response.Headers["Access-Token"] = _tokenService
                .GenerateAccessToken(user);

            return Ok(user);
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