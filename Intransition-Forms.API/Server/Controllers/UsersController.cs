using CSharpFunctionalExtensions;
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

        private delegate Task<Result> UpdateUsersDelegate(Guid[] users);

        public UsersController(IUsersRepository usersRepository, ITokenService tokenService)
        {
            _userRepository = usersRepository;
            _tokenService = tokenService;
        }

        [HttpGet]
        //[Authorize] Deleted cause hosting error
        public async Task<IActionResult> GetUser()
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");
                
            if (userId == null)
                return Conflict();

            var user = await _userRepository.GetUserById(Guid.Parse(userId));

            if (user == null)
                return Conflict();

            Response.Headers["Access-Token"] = _tokenService
                .GenerateAccessToken(user);

            return Ok(user);
        }

        [HttpGet]
        [Authorize]
        [Route("/api/users/all")]
        public async Task<IActionResult> GetAllUsers(int from, int count)
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");
            var role = _tokenService.GetClaimFromRequest(Request, "role");

            if (userId == null)
                return Conflict();

            if (role == null || role != "Admin")
                return Conflict();

            var users = await _userRepository.GetUsers(from, count);

            return Ok(users);
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

        public enum UpdateUserOperations
        {
            Unblock,
            Block,
            Delete,
            AddAdminRights,
            RemoveAdminRights,
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateUsers([FromForm] Guid[] users, [FromForm] UpdateUserOperations operation)
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");
            var role = _tokenService.GetClaimFromRequest(Request, "role");

            if (userId == null)
                return Conflict();

            if (role == null || role != "Admin")
                return Conflict();

            var operations = new Dictionary<UpdateUserOperations, UpdateUsersDelegate>()
            {
                { UpdateUserOperations.Unblock, _userRepository.UnblockUsers },
                { UpdateUserOperations.Block, _userRepository.BlockUsers },
                { UpdateUserOperations.Delete, _userRepository.DeleteUsers },
                { UpdateUserOperations.AddAdminRights, (Guid[] users) => _userRepository.UpdateAdminState(users, true) },
                { UpdateUserOperations.RemoveAdminRights, (Guid[] users) => _userRepository.UpdateAdminState(users, false) },
            };

            operations.TryGetValue(operation, out UpdateUsersDelegate? handler);

            if (handler == null)
                return BadRequest("Invalid operation type");

            var result = await handler(users);

            if (result.IsFailure)
                return Conflict(result.Error);

            return Ok();
        }
    }
}