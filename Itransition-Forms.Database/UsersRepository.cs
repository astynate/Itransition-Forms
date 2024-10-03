using CSharpFunctionalExtensions;
using Itransition_Forms.Core.User;
using Itransition_Forms.Dependencies.Database;
using Itransition_Forms.Dependencies.Services;
using Microsoft.EntityFrameworkCore;

namespace Itransition_Forms.Database
{
    public class UsersRepository : IUsersRepository
    {
        private readonly DatabaseContext _context;

        private readonly IEncryptionService _encryptionService;

        public UsersRepository(DatabaseContext context, IEncryptionService encryptionService)
        {
            _context = context;
            _encryptionService = encryptionService;
        }

        public async Task<Result<UserModel>> Register(string email, string password, int color)
        {
            var user = UserModel.Create(email, password, color);

            if (user.IsFailure) return user;

            user.Value.HashPassword(_encryptionService.HashUsingSHA256);

            await _context.AddAsync(user.Value);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<Result<UserModel>> Login(string email, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => 
                    x.Password == _encryptionService.HashUsingSHA256(password) && 
                    x.Email == email);

            if (user == null)
                return Result.Failure<UserModel>("User not found");

            return user;
        }
    }
}