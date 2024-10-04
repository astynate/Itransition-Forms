using Instend.Server.Middleware;
using Itransition_Form.Services;
using Itransition_Forms.Database;
using Itransition_Forms.Dependencies.Database;
using Itransition_Forms.Dependencies.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using static CSharpFunctionalExtensions.Result;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
        .SetIsOriginAllowed(origin => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Configuration
    .AddJsonFile("Server/appsettings.json")
    .Build();

var enctyptionService = new EncryptionService();
var secretKey = builder.Configuration.GetValue<string>("SecretKey");
var issuer = builder.Configuration.GetValue<string>("Issuer");
var audience = builder.Configuration.GetValue<string>("Audience");
var symmetricKey = enctyptionService.GetSymmetricKey(secretKey ?? "");

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = symmetricKey,
        };
    });

builder.Services.AddTransient<LoggingMiddleware>();
builder.Services.AddDbContext<DatabaseContext>();
builder.Services.AddSingleton<IEncryptionService, EncryptionService>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddSingleton<ITokenService, TokenService>();
builder.Services.AddControllersWithViews();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseMiddleware<LoggingMiddleware>();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("CorsPolicy");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.UseAuthentication();
app.UseAuthorization();

app.Run();