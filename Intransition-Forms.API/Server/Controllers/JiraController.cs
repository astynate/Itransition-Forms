using Instend.Server.External;
using Itransition_Forms.Database.Repositories;
using Itransition_Forms.Dependencies.Database;
using Itransition_Forms.Dependencies.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/jira")]
    public class JiraController : ControllerBase
    {
        private readonly JiraAPI _jiraAPI = null!;

        private readonly IUsersRepository _usersRepository = null!;

        private readonly ITokenService _tokenService = null!;

        private readonly IIssuesRepository _issuesRepository = null!;

        public JiraController(JiraAPI jiraAPI, IUsersRepository usersRepository, ITokenService tokenSevice, IIssuesRepository issuesRepository)
        {
            _jiraAPI = jiraAPI;
            _usersRepository = usersRepository;
            _tokenService = tokenSevice;
            _issuesRepository = issuesRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetIssues()
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(userId) || string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var user = await _usersRepository.GetUserById(Guid.Parse(userId));

            if (user == null)
                return Conflict("User not found");

            return Ok(await _issuesRepository.GetUserIssues(Guid.Parse(userId)));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateNewIssue
        (
            [FromForm] string title,
            [FromForm] string priority,
            [FromForm] string link,
            [FromForm] string description
        )
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(userId) || string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var user = await _usersRepository.GetUserById(Guid.Parse(userId));

            if (user == null)
                return Conflict("User not found");

            var jiraUser = await _jiraAPI.GetUserByEmail(user.Email) ?? await _jiraAPI.CreateJiraUser(user);

            if (jiraUser is null)
                return Conflict("User creation failed.");

            var issue = await _jiraAPI.CreateIssue(jiraUser, user.Id, title, description, link, priority);

            if (issue == null)
                return Conflict("Issue has not been created.");

            return Ok();
        }
    }
}