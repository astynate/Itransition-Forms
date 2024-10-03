using Itransition_Forms.Core.User;

namespace Itransition_Forms.Dependencies.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(UserModel user);
    }
}