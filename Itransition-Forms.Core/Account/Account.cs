namespace Itransition_Forms.Core.Account
{
    public class Account
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;

        public Account(string id, string name, string desciption)
        {
            Id = id;
            Name = name;
            Description = desciption;
        }
    }
}