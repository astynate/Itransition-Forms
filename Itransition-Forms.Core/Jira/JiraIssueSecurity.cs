namespace Itransition_Forms.Core.Jira
{
    public class JiraIssueSecurity
    {
        public FieldsModel? Fields { get; init; } = null;

        public class FieldsModel 
        { 
            public Security? Security { get; init; }
        }
        
        public class Security
        {
            public string Id { get; init; } = string.Empty;
        }
    }
}