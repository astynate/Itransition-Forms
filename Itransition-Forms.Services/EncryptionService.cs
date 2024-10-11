using Itransition_Forms.Dependencies.Services;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;

namespace Itransition_Form.Services
{
    public class EncryptionService : IEncryptionService
    {
        public string HashUsingSHA256(string value)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(value));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        public SymmetricSecurityKey GetSymmetricKey(string key)
            => new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    }
}