using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Jira
{
    public class JiraUser
    {
        public string? AccountId { get; init; } = string.Empty;
        public string? Self { get; init; } = string.Empty;
        public string? Name { get; init; } = string.Empty;
        public string? AccountType { get; init; } = string.Empty;
        public string? Key { get; init; } = string.Empty;
        public string? EmailAddress { get; init; } = string.Empty;
        public string? DisplayName { get; init; } = string.Empty;
        public bool Active { get; init; } = true;
        public string? TimeZone { get; init; } = "Europe/Minsk";

        [JsonConstructor]
        public JiraUser
        (
            string accountId,
            string self,
            string name,
            string accountType,
            string key,
            string emailAddress,
            string displayName,
            bool active,
            string timeZone
        )
        {
            AccountId = accountId;
            Self = self;
            Name = name;
            AccountType = accountType;
            Key = key;
            EmailAddress = emailAddress;
            DisplayName = displayName;
            Active = active;
            TimeZone = timeZone;
        }
    }
}