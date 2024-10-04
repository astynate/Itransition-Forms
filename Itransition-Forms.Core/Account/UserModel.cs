using CSharpFunctionalExtensions;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;

namespace Itransition_Forms.Core.User
{
    [Table("users")]
    public class UserModel
    {
        [Column("id")] public Guid Id { get; private set; } = Guid.Empty;
        [Column("email")] public string Email { get; private set; } = string.Empty;
        [Column("password")] public string Password { get; private set; } = string.Empty;
        [Column("color")] public int Color { get; private set; } = 0;
        [Column("is_admin")] public bool IsAdmin { get; set; } = false;

        private UserModel() { }

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
    }
}