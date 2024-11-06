namespace Itransition_Forms.Core.Jira
{
    public class JiraSecurityScheme
    {
        public string Name { get; init; } = string.Empty;
        public string Description { get; init; } = string.Empty;
        public Level[] Levels { get; init; } = [];
        
        public class Level 
        { 
            public string Name { get; init; } = string.Empty;
            public string Description { get; init; } = string.Empty;
            public Member[] Members { get; init; } = [];
        }
        
        public class Member
        {
            public string User { get; init; } = string.Empty;
        }
    }
}