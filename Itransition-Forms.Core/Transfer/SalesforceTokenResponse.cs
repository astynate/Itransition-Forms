namespace Itransition_Forms.Core.Transfer
{
    public class SalesforceTokenResponse
    {
        public string access_token { get; init; } = null!;
        public string instance_url { get; init; } = null!;
        public string id { get; init; } = null!;
        public string token_type { get; init; } = null!;
        public string issued_at { get; init; } = null!;
        public string signature { get; init; } = null!;
    }
}