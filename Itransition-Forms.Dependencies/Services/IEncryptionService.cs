using Microsoft.IdentityModel.Tokens;

namespace Itransition_Forms.Dependencies.Services
{
    public interface IEncryptionService
    {
        SymmetricSecurityKey GetSymmetricKey(string key);
        string HashUsingSHA256(string value);
    }
}