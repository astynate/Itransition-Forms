using Itransition_Forms.Core.User;
using Itransition_Forms.Dependencies.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Itransition_Form.Services
{
    public class TokenService : ITokenService
    {
        private readonly IEncryptionService _encryptionService;

        private readonly IConfiguration _configuration;

        private readonly string _secretKey;

        public TokenService(IEncryptionService encryptionService, IConfiguration configuration)
        {
            _encryptionService = encryptionService;
            _configuration = configuration;
            _secretKey = _configuration["SecretKey"] ?? "";
        }

        public string GenerateAccessToken(UserModel user)
        {
            var claims = new List<Claim> { 
                new Claim("sub", user.Email),
                new Claim("id", user.Id.ToString()),
                new Claim("role", user.IsAdmin ? "Admin" : "User")
            };

            var jwt = new JwtSecurityToken(
                issuer: _configuration.GetValue<string>("Issuer"),
                audience: _configuration.GetValue<string>("Audience"),
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromDays(30)),
                signingCredentials: new SigningCredentials(
                    _encryptionService.GetSymmetricKey(_secretKey), 
                    SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        public string? GetClaimFromToken(string token, string claimName)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            return jsonToken?.Claims.First(claim => claim.Type == claimName).Value;
        }

        private bool ValidateToken(string token, bool validateLifetime)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = _encryptionService.GetSymmetricKey(_secretKey);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = validateLifetime,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool IsTokenValid(string token)
            => ValidateToken(token, false);

        public bool IsTokenAlive(string token)
            => ValidateToken(token, true);
    }
}