using ChatApp.Hubs;
using ChatApp.Services.Implementations;
using ChatApp.Services.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SignalR;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSingleton<IChatService, ChatService>();
builder.Services.AddSignalR(e => { e.MaximumReceiveMessageSize = 102400000; });
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(x=>x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200"));
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/hubs/chat");

app.Run();