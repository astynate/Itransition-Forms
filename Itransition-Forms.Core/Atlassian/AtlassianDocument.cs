namespace Itransition_Forms.Core.Atlassian
{
    public class AtlassianDocument
    {
        public string Type { get; set; } = "doc";
        public int Version { get; set; } = 1;
        public AtlassianContent[] Content { get; set; } = [];

        public class AtlassianContent
        {
            public string Type { get; set; } = "paragraph";
            public AtlassianContentBase[] Content { get; set; } = [];
        }

        public class AtlassianContentBase
        {
            public string Type { get; set; } = "text";
        }

        public class ContentText : AtlassianContentBase
        {
            public string Text { get; set; } = string.Empty;
        }

        public class ContentLink : AtlassianContentBase
        {
            public string Text { get; set; } = string.Empty;
            public List<Mark> Marks { get; set; } = new List<Mark>(); 
            
            public class Mark
            {
                public string Type { get; set; } = "link";
                public Attributes? Attrs { get; set; } = null;

                public class Attributes {
                    public string Href { get; set; } = string.Empty;
                    public string Title { get; set; } = string.Empty;
                }
            }
        }
    }
}