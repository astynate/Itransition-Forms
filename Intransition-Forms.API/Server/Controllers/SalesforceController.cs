using Microsoft.AspNetCore.Mvc;
using Itransition_Forms.Dependencies.Database;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Itransition_Forms.Dependencies.Services;
using Newtonsoft.Json;
using Itransition_Forms.Core.User;
using Instend.Server.External;
using Microsoft.AspNet.SignalR.Hosting;
using Itransition_Forms.Core.Account;

namespace Instend.Server.Controllers
{
    [ApiController]
    [Route("/api/salesforce")]
    public class SalesforceController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        private readonly IHttpClientFactory _httpClientFactory;

        private readonly ITokenService _tokenService;

        private readonly SalesforceAPI _salesforceAPI;

        private readonly IUsersRepository _usersRepository;

        private readonly string _salesforceDomain = "";

        public SalesforceController
        (
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory, 
            IUsersRepository usersRepository,
            SalesforceAPI salesforceAPI,
            ITokenService tokenService
        )
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _usersRepository = usersRepository;
            _salesforceAPI = salesforceAPI;
            _salesforceDomain = _configuration.GetValue<string>("SalesforceDomain") ?? "";
            _tokenService = tokenService;
        }

        public record class NewAccountData
        {
            public string FirstName { get; set; } = string.Empty;
            public string LastName { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
            public string Phone { get; set; } = string.Empty;
            public DateTime Birthdate { get; set; } = DateTime.Now;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateUser([FromForm] NewAccountData form)
        {
            var userId = _tokenService.GetClaimFromRequest(Request, "sub");

            if (string.IsNullOrEmpty(userId) || string.IsNullOrWhiteSpace(userId))
                return BadRequest("User not found");

            var user = await _usersRepository.GetUserById(Guid.Parse(userId));
            var token = await _salesforceAPI.GetSalesforceTokenAsync();

            if (token == null || user == null)
                return Conflict("User not found or connection to Salesforce was failed. Please try again.");

            if (string.IsNullOrWhiteSpace(user.SalesforceAccountId) == false)
                return Ok("The salesforce contact is already been created.");

            var accountId = await CreateAccount(token, form);

            if (string.IsNullOrEmpty(accountId) || string.IsNullOrWhiteSpace(accountId))
                return Conflict("Connection to Salesforce was failed. Please try again.");

            await _usersRepository.UpdateSalesforceAccountId(user, accountId);
            await CreateContact(token, form, user, accountId);
            
            return Ok();
        }

        private async Task<string?> CreateAccount(string token, NewAccountData data)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                
                var account = new
                {
                    Name = data.FirstName + " " + data.LastName,
                    data.Description,
                };
                
                var json = new StringContent(JsonConvert.SerializeObject(account), Encoding.UTF8, "application/json");
                var response = await client.PostAsync($"{_salesforceDomain}/services/data/v43.0/sobjects/account/", json);
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var result = JsonConvert.DeserializeObject<dynamic>(jsonResponse);

                    return result?.id;
                }
            }

            return null;
        }

        private async Task<string?> CreateContact(string token, NewAccountData data, UserModel user, string accountId)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                
                var contact = new
                {
                    data.FirstName,
                    data.LastName,
                    user.Email,
                    data.Phone,
                    AccountId = accountId,
                    data.Birthdate
                };

                var json = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(contact), Encoding.UTF8, "application/json");
                var response = await client.PostAsync($"{_salesforceDomain}/services/data/v43.0/sobjects/contact/", json);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var result = JsonConvert.DeserializeObject<dynamic>(jsonResponse);

                    return result?.id;
                }

                return null;
            }
        }
    }
}