using Itransition_Form.Services;
using Itransition_Forms.Database;
using Itransition_Forms.Dependencies.Database;
using Itransition_Forms.Dependencies.Services;

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

builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

builder.Services.AddAuthorization();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

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