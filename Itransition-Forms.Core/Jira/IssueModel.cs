using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Itransition_Forms.Core.Jira
{
    [Table("issues")]
    public class IssueModel
    {
        [Column("Id")][Key] public Guid EntityId { get; init; } = Guid.NewGuid();
        [Column("owner_id")] public Guid UserModelId { get; set; }
        [Column("jira_issue_id")] public string Id { get; init; } = string.Empty;
        [Column("title")] public string Title { get; init; } = string.Empty;
        [Column("description")] public string Description { get; init; } = string.Empty;
        [Column("link")] public string Link { get; init; } = string.Empty;
        [Column("priority")] public string Priority { get; init; } = string.Empty;
        [Column("jira_issue_key")] public string Key { get; init; } = string.Empty;
        [Column("jira_issue_self")] public string Self { get; init; } = string.Empty;

        [JsonConstructor]
        public IssueModel
        (
            string id, 
            string title, 
            string description, 
            string link, 
            string priority, 
            string key, 
            string self,
            Guid userModelId
        )
        {
            Id = id;
            Key = key;
            Self = self;
            Title = title;
            Description = description;
            Priority = priority;
            Link = link;
            UserModelId = userModelId;
        }
    }
}