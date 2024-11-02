namespace Itransition_Forms.Core.Account
{
    public class Contact
    {
        public string Id { get; init; } = null!;
        public string FirstName { get; init; } = null!;
        public string LastName { get; init; } = null!;
        public string Email { get; init; } = null!;
        public string Phone { get; init; } = null!;
        public string AccountId { get; init; } = null!;
        public DateTime Birthdate { get; init; } = DateTime.Now;

        public Contact() { }

        public Contact
        (
            string id,
            string firstName,
            string lastName,
            string email,
            string phone,
            DateTime birthdate,
            string accountId
        )
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Phone = phone;
            Birthdate = birthdate;
            AccountId = accountId;
        }
    }
}