using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        public string CreateToken(AppUser user)
        {
            // Step 1
            var claims = new List<Claim>
            {
                // we add anything we want to keep track of
                // for example: username, email, id
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
            };

            // Step 2 create a key from secret key, we are using dumb key here
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super secret key"));
            // Step 3 using strongest one algorithm atm HmacSha512Signature
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Step 4
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            // Step 5 create token handler
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}