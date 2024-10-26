using CSharpFunctionalExtensions;
using Itransition_Forms.Core.Form;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace Itransition_Forms.Core.User
{
    [Table("users")]
    public class UserModel : IEquatable<UserModel>
    {
        [Column("id")][Key] public Guid Id { get; private set; } = Guid.Empty;
        [Column("email")] public string Email { get; private set; } = string.Empty;
        [Column("password")] public string Password { get; private set; } = string.Empty;
        [Column("color")] public int Color { get; private set; } = 0;
        [Column("is_admin")] public bool IsAdmin { get; set; } = false;
        [Column("is_blocked")] public bool IsBlocked { get; set; } = false;

        [JsonIgnore] public List<FormModel> Forms { get; set; } = [];

        private UserModel() { }

        [JsonConstructor]
        protected UserModel(Guid id, string email, string password, int color, bool isAdmin, bool isBlocked) 
        { 
            Id = id;
            Email = email;
            Password = password;
            Color = color;
            IsAdmin = isAdmin;
            IsBlocked = isBlocked;
        }

        public static Result<UserModel> Create(string email, string password, int color)
        {
            if (IsValidEmail(email) == false)
                return Result.Failure<UserModel>("Invalid email");

            if (string.IsNullOrEmpty(password) || string.IsNullOrWhiteSpace(password))
                return Result.Failure<UserModel>("Password is required");

            if (password.Length < 8)
                return Result.Failure<UserModel>("Password should have at least 8 symbols");

            if (color < 0 || color > 2)
                return Result.Failure<UserModel>("Invalid color");

            return new UserModel()
            {
                Email = email,
                Password = password,
                Color = color
            };
        }

        public void HashPassword(Func<string, string> encryptionFunction)
            => Password = encryptionFunction(Password);

        public static bool IsValidEmail(string email)
        {
            string emailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(email, emailPattern);
        }

        public bool Equals(UserModel? other)
        {
            if (other == null)
            {
                return false;
            }

            return other.Id == Id;
        }
    }
}