using Itransition_Form.Services;
using Itransition_Forms.Core.Atlassian;
using Itransition_Forms.Core.Form;
using Itransition_Forms.Core.Jira;
using Itransition_Forms.Core.User;
using Itransition_Forms.Database.Repositories;
using Itransition_Forms.Dependencies.Database;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using static Itransition_Forms.Core.Atlassian.AtlassianDocument;

namespace Instend.Server.External
{
    public class JiraAPI
    {
        private readonly IConfiguration _configuration;

        private readonly IIssuesRepository _issuesRepository;

        private readonly ISerializationHelper _serializationHelper;

        private readonly IFormsRepository _formsRepository;

        private readonly string _projectKey = "SCRUM";

        private readonly string _atlassianDomain = "";

        public JiraAPI
        (
            IConfiguration configuration,
            IIssuesRepository issuesRepository,
            ISerializationHelper serializationHelper,
            IFormsRepository formsRepository
        )
        {
            _configuration = configuration;
            _issuesRepository = issuesRepository;
            _serializationHelper = serializationHelper;
            _atlassianDomain = _configuration.GetValue<string>("AtlassianDomain") ?? "";
            _formsRepository = formsRepository;
        }

        public async Task<JiraUser?> GetUserByEmail(string email)
        {
            var destination = $"{_atlassianDomain}/rest/api/3/user/search?query={email}";

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = GetAuthToken();

                var response = await client.GetAsync(destination);

                if (response.IsSuccessStatusCode)
                {
                    var responseAsJson = await response.Content.ReadAsStringAsync();
                    var users = JsonConvert.DeserializeObject<List<JiraUser>>(responseAsJson);

                    return users?.FirstOrDefault();
                }

                return null; 
            }
        }

        public async Task<string?> CreateSecurityScheme(string issueId, string email)
        {
            var scheme = new JiraSecurityScheme
            {
                Name = "Read-Only Security Scheme",
                Description = "Security scheme for read-only access",
                Levels = 
                [
                    new JiraSecurityScheme.Level 
                    { 
                        Name = "Read-Only", 
                        Description = "Read-only access level", 
                        Members = 
                        [
                            new JiraSecurityScheme.Member { User = email }
                        ] 
                    }
                ]
            };

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = GetAuthToken();

                var url = $"{_atlassianDomain}/rest/api/2/issuesecurityschemes";
                var content = new StringContent(JsonConvert.SerializeObject(scheme), Encoding.UTF8, "application/json");

                var response = await client.PostAsync(url, content);
                var responseAsText = await response.Content.ReadAsStringAsync();

                return responseAsText;
            }
        }

        private AuthenticationHeaderValue GetAuthToken()
        {
            var username = _configuration.GetValue<string>("ATLASSIAN_USERNAME");
            var apiToken = _configuration.GetValue<string>("ATLASSIAN_API_TOKEN");
            var authToken = Encoding.ASCII.GetBytes($"{username}:{apiToken}");

            return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(authToken));
        }

        private async Task<FormModel?> FindFormInRouteIfExist(string route)
        {
            Match match = Regex.Match(route, @"/form/(?<id>[^/]+)");
            
            if (match.Success)
            {
                var guidId = match.Groups["id"].Value;
                var form = await _formsRepository.GetFormModelById(Guid.Parse(guidId));

                return form;
            }

            return null;
        }

        public async Task<IssueModel?> CreateIssue(JiraUser user, Guid userId, string title, string description, string link, string priority)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = GetAuthToken();

                var form = await FindFormInRouteIfExist(link);

                var issue = new JiraIssue
                {
                    Fields = new JiraIssue.FieldsModel
                    {
                        Project = new JiraIssue.Project { Key = _projectKey },
                        Summary = title,
                        Reporter = new JiraIssue.Repoter() { Id = user.AccountId ?? "" },
                        Priority = new JiraIssue.Priority { Name = priority },
                        issuetype = new JiraIssue.IssueType { Name = "Bug" },
                        Description = new AtlassianDocument()
                        {
                            Content =
                            [
                                new AtlassianContent()
                                {
                                    Content = 
                                    [
                                        new ContentText()
                                        {
                                            Text = description
                                        }
                                    ]
                                }
                            ],
                        },
                        customfield_10038 = form != null ? form.Title : "",
                        customfield_10037 = link
                    }
                };

                var json = _serializationHelper.SerializeWithCamelCase(issue);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync($"{_atlassianDomain}/rest/api/3/issue", content);

                if (response.IsSuccessStatusCode) 
                {
                    var responseData = await response.Content.ReadAsStringAsync();
                    var issueModel = JsonConvert.DeserializeObject<IssueModel>(responseData);

                    if (issueModel == null)
                        return null;

                    return await _issuesRepository.AddAsync
                    (
                        issueModel.Id,
                        title,
                        description,
                        link,
                        priority,
                        issueModel.Key, 
                        issueModel.Self,
                        userId
                    );
                }

                return null;
            }
        }

        public async Task<HttpResponseMessage> SetIssueSecurity(string issueKey, string securityLevelId)
        {
            var url = $"{_atlassianDomain}/rest/api/2/issue/{issueKey}";
            
            var security = new JiraIssueSecurity 
            { 
                Fields = new JiraIssueSecurity.FieldsModel 
                { 
                    Security = new JiraIssueSecurity.Security 
                    { 
                        Id = securityLevelId 
                    } 
                } 
            }; 
            
            var content = new StringContent(JsonConvert.SerializeObject(security), Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = GetAuthToken();

                return await client.PutAsync(url, content);
            }
        }

        public async Task<JiraUser?> CreateJiraUser(UserModel user)
        {
            var payload = new 
            { 
                emailAddress = user.Email, 
                displayName = user.Account != null ? user.Account.Name : "Unknown",
                products = new[] { "jira-software" }
            };

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = GetAuthToken();

                var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
                var response = await client.PostAsync($"{_atlassianDomain}/rest/api/3/user", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseData = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<JiraUser>(responseData);
                }
            }

            return null;
        }
    }
}