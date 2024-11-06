using Itransition_Forms.Core.Atlassian;
using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Jira
{
    public class JiraIssue
    {
        public FieldsModel? Fields { get; init; } = null;
        
        public class Project 
        { 
            public string Key { get; init; } = string.Empty;
        }
        
        public class IssueType 
        {
            public string Name { get; init; } = string.Empty;
        }

        public class Repoter
        {
            public string Id { get; init; } = string.Empty;
        }

        public class Priority
        {
            public string Name { get; init; } = "2000";
        }

        public class FieldsModel
        {
            [JsonPropertyName("reporter")] public Repoter? Reporter { get; init; } = null;
            [JsonPropertyName("priority")] public Priority? Priority { get; init; } = null;
            [JsonPropertyName("project")] public Project? Project { get; init; } = null;
            [JsonPropertyName("issuetype")] public IssueType? issuetype { get; init; } = null;
            [JsonPropertyName("summary")] public string Summary { get; init; } = string.Empty;
            [JsonPropertyName("description")] public AtlassianDocument? Description { get; init; } = null;
            [JsonPropertyName("customfield_10038")] public string customfield_10038 { get; init; } = string.Empty;
            [JsonPropertyName("customfield_10037")] public string customfield_10037 { get; init; } = string.Empty;
        }
    }
}