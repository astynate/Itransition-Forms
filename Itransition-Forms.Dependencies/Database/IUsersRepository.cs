using CSharpFunctionalExtensions;
using Itransition_Forms.Core.User;

namespace Itransition_Forms.Dependencies.Database
{
    public interface IUsersRepository
    {
        Task<UserModel?> GetUserById(Guid id);
        Task<UserModel[]> GetUsers(int from, int count);
        Task<Result<UserModel>> Login(string email, string password);
        Task<Result<UserModel>> Register(string email, string password, int color);
        Task<Result> BlockUsers(Guid[] users);
        Task<Result> UnblockUsers(Guid[] users);
        Task<Result> DeleteUsers(Guid[] users);
        Task<Result> UpdateAdminState(Guid[] users, bool isAdmin);
        Task<UserModel[]> GetUserByPrefix(string prefix);
    }
}