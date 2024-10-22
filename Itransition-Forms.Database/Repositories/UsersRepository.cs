using CSharpFunctionalExtensions;
using Itransition_Forms.Core.User;
using Itransition_Forms.Database.Contexts;
using Itransition_Forms.Dependencies.Database;
using Itransition_Forms.Dependencies.Services;
using Microsoft.EntityFrameworkCore;

namespace Itransition_Forms.Database.Repositories
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

        public async Task<UserModel[]> GetUsers(int from, int count)
        {
            return await _context.Users
                .OrderBy(u => u.Id)
                .Skip(from)
                .Take(count)
                .ToArrayAsync();
        }

        public async Task<UserModel?> GetUserById(Guid userId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.Id == userId);
        }

        public async Task<Result<UserModel>> Register(string email, string password, int color)
        {
            var user = UserModel.Create(email, password, color);

            if (user.IsFailure) return user;

            user.Value.HashPassword(_encryptionService.HashUsingSHA256);

            try
            {
                await _context.AddAsync(user.Value);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Result.Failure<UserModel>("Owner with the same email is already exist");
            }

            return user;
        }

        public async Task<Result<UserModel>> Login(string email, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Password == _encryptionService.HashUsingSHA256(password) &&
                    x.Email == email);

            if (user == null)
                return Result.Failure<UserModel>("Owner not found");

            return user;
        }

        private async Task<Result> UpdateBlockedState(Guid[] users, bool state)
        {
            var result = await _context.Users
                .Where(user => users.Contains(user.Id))
                .ExecuteUpdateAsync(u => u.SetProperty(e => e.IsBlocked, state));

            await _context.SaveChangesAsync();

            return result > 0 ? Result.Success() : Result.Failure("Users not found");
        }

        public async Task<Result> BlockUsers(Guid[] users)
            => await UpdateBlockedState(users, true);

        public async Task<Result> UnblockUsers(Guid[] users)
            => await UpdateBlockedState(users, false);

        public async Task<Result> UpdateAdminState(Guid[] users, bool isAdmin)
        {
            var result = await _context.Users
                .Where(user => users.Contains(user.Id))
                .ExecuteUpdateAsync(u => u.SetProperty(e => e.IsAdmin, isAdmin));

            await _context.SaveChangesAsync();

            return result > 0 ? Result.Success() : Result.Failure("Users not found");
        }

        public async Task<Result> DeleteUsers(Guid[] users)
        {
            var result = await _context.Users
                .Where(user => users.Contains(user.Id))
                .ExecuteDeleteAsync();

            await _context.SaveChangesAsync();

            return result > 0 ? Result.Success() : Result.Failure("Users not found");
        }
    }
}