using Itransition_Forms.Core.User;
using Itransition_Forms.Dependencies.Services;
using Microsoft.AspNetCore.Http;
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
                new Claim("sub", user.Id.ToString()),
                new Claim("email", user.Email),
                new Claim("role", user.IsAdmin ? "Admin" : "Owner")
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

        public string? GetTokenFromRequest(HttpRequest request)
        {
            var bearer = request.Headers["Authorization"].FirstOrDefault();

            if (bearer == null || bearer.Split(" ").Length < 2)
                return null;

            return bearer.Split(" ")[1];
        }

        public string? GetClaimFromRequest(HttpRequest request, string claimName)
        {
            var token = GetTokenFromRequest(request);

            if (token == null) return null;

            return GetClaimFromToken(token, claimName);
        }
    }
}