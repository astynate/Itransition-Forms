using Instend.Server.Middleware;
using Itransition_Form.Services;
using Itransition_Forms.Core.Answers;
using Itransition_Forms.Database.Contexts;
using Itransition_Forms.Database.Repositories;
using Itransition_Forms.Dependencies.Database;
using Itransition_Forms.Dependencies.Services;
using Itransition_Forms.PreviewService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;
using System.Text.Json.Serialization;

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

var encryptionService = new EncryptionService();
var secretKey = builder.Configuration.GetValue<string>("SecretKey");
var issuer = builder.Configuration.GetValue<string>("Issuer");
var audience = builder.Configuration.GetValue<string>("Audience");
var symmetricKey = encryptionService.GetSymmetricKey(secretKey ?? "");

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

builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseMySql(builder.Configuration.GetValue<string>("ConnectionString"),
        new MySqlServerVersion(new Version(8, 3, 0)),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure());

    options.EnableSensitiveDataLogging();
});

builder.Services.AddTransient<LoggingMiddleware>();
builder.Services.AddSingleton<IEncryptionService, EncryptionService>();
builder.Services.AddScoped<IFormsRepository, FormsRepository>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IFillingsRepository, FillingsRepository>();
builder.Services.AddScoped<ISerializationHelper, SerializationHelper>();
builder.Services.AddScoped<IPreviewService, PreviewService>();
builder.Services.AddScoped<IStatisticRepository, StatisticRepository>();
builder.Services.AddScoped<ITagsRepository, TagsRepository>();
builder.Services.AddSingleton<ITokenService, TokenService>();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.IncludeFields = true;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.Converters.Add(new AnswerBaseConverter());
    });

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseMiddleware<LoggingMiddleware>();

app.Use(async (context, next) =>
{
    if (context.Request.Headers.TryGetValue("ItransitionAuthorization", out var iTransitionAuthValue))
    {
        context.Request.Headers["Authorization"] = iTransitionAuthValue;
    }

    await next.Invoke();
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("CorsPolicy");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{FormsId?}");

app.MapFallbackToFile("index.html");

app.UseAuthentication();
app.UseAuthorization();

app.Run();