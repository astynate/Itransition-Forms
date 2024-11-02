using Itransition_Forms.Core.Account;
using Itransition_Forms.Core.Transfer;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace Instend.Server.External
{
    public class SalesforceAPI
    {
        private readonly IConfiguration _configuration;

        private readonly string _salesforceDomain = "";

        public SalesforceAPI(IConfiguration configuration)
        {
            _configuration = configuration;
            _salesforceDomain = _configuration.GetValue<string>("SalesforceDomain") ?? "";
        }

        public async Task<(Account? account, Contact? contact)> GetAccountAndContactById(string accountId)
        {
            var token = await GetSalesforceTokenAsync();

            if (string.IsNullOrEmpty(token) || string.IsNullOrWhiteSpace(token))
                return (null, null);

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var accountResponse = await client.GetAsync($"{_salesforceDomain}/services/data/v43.0/sobjects/account/{accountId}");

                if (!accountResponse.IsSuccessStatusCode)
                    return (null, null);

                var accountJson = await accountResponse.Content.ReadAsStringAsync();
                var account = JsonConvert.DeserializeObject<Account>(accountJson);
                var query = $"SELECT Id, FirstName, LastName, Email, Phone, AccountId FROM Contact WHERE AccountId='{accountId}'";
                var contactResponse = await client.GetAsync($"{_salesforceDomain}/services/data/v43.0/query?q={Uri.EscapeDataString(query)}");

                if (!contactResponse.IsSuccessStatusCode)
                    return (null, null);

                var contactJson = await contactResponse.Content.ReadAsStringAsync();
                var contacts = JsonConvert.DeserializeObject<dynamic>(contactJson);

                if (contacts == null || contacts?.records == null || contacts?.records is not IEnumerable<object>)
                    return (null, null);

                var contactList = contacts?.records.ToObject<List<Contact>>();
                
                if (contactList != null && contactList?.Count > 0)
                    return (account, contactList?[0]);

                return (null, null);
            }
        }

        public async Task<string?> GetSalesforceTokenAsync()
        {
            var userData = new Dictionary<string, string>
            {
                { "grant_type", "password" },
                { "client_id", _configuration.GetValue<string>("CONSUMER_KEY") ?? "" },
                { "client_secret", _configuration.GetValue<string>("CONSUMER_SECRET") ?? "" },
                { "username", _configuration.GetValue < string >("USERNAME_SALESFORCE") ?? "" },
                { "password", _configuration.GetValue<string>("PASSWORD") ?? "" }
            };

            using (var client = new HttpClient())
            {
                var content = new FormUrlEncodedContent(userData);
                var response = await client.PostAsync($"{_salesforceDomain}/services/oauth2/token", content);

                response.EnsureSuccessStatusCode();

                try
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var result = JsonConvert.DeserializeObject<SalesforceTokenResponse>(jsonResponse);
                    var resultToken = result is SalesforceTokenResponse responseData ? responseData.access_token : null;

                    return resultToken;
                }
                catch (Exception)
                {
                    return null;
                }
            }
        }
    }
}