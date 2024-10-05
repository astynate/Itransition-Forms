using Itransition_Forms.Core.User;
using Microsoft.AspNetCore.Http;

namespace Itransition_Forms.Dependencies.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(UserModel user);
        string? GetClaimFromRequest(HttpRequest request, string claimName);
        string? GetClaimFromToken(string token, string claimName);
        string? GetTokenFromRequest(HttpRequest request);
    }
}