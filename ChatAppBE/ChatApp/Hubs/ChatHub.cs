using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChatApp.Models;
using ChatApp.Services.Implementations;
using ChatApp.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Hubs;

public class ChatHub : Hub
{
    private readonly IChatService _chatService;
    public ChatHub(IChatService chatService)
    {
        _chatService = chatService;
    }

    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "ChatApp");
        await Clients.Caller.SendAsync("UserConnected");
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "ChatApp");

        string user;
        try
        {

            user = _chatService.GetUserByConnectionId(Context.ConnectionId);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        if(user == null)
            throw new Exception("User not found by connection id: " + Context.ConnectionId);
        _chatService.RemoveUserFromDict(user);
        await DisplayOnlineUsers();
        await base.OnDisconnectedAsync(exception);
    }
    
    public async Task AddUserConnectionId(string user)
    {
        _chatService.AddConnectionIdToDict(user, Context.ConnectionId);
        await DisplayOnlineUsers();
    }

    public async Task SendMessage(string user, string message)
    {
        string connectionId = _chatService.GetConnectionIdByUser(user);
        if (connectionId == null)
            throw new Exception("User not found: " + user);
        await Clients.Client(connectionId).SendAsync("ReceiveMessage", user, message);
    }
    
    public async Task ReceiveMessage(MessageDto message)
    {
        await Clients.Group("ChatApp").SendAsync("NewMessage", message);
    }

    public async Task CreatePrivateChat(MessageDto message)
    {
        string privateGroupName = getPrivateGroupName(message.From, message.To);
        await Groups.AddToGroupAsync(Context.ConnectionId, privateGroupName);
        var toConnectionId = _chatService.GetConnectionIdByUser(message.To);
        if (toConnectionId == null)
            throw new Exception("User not found: " + message.To);
        
        await Groups.AddToGroupAsync(toConnectionId, privateGroupName);
        await Clients.Client(toConnectionId).SendAsync("OpenPrivateChat", message);
    }
    
    public async Task ReceivePrivateMessage(MessageDto message)
    {
        string privateGroupName = getPrivateGroupName(message.From, message.To);
        await Clients.Group(privateGroupName).SendAsync("NewPrivateMessage", message);
    }

    public async Task RemovePrivateChat(string from, string to)
    {
        string privateGroupName = getPrivateGroupName(from, to);
        await Clients.Group(privateGroupName).SendAsync("ClosePrivateChat");
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, privateGroupName);
        string toConnectionId = _chatService.GetConnectionIdByUser(to);
        if (toConnectionId == null)
            throw new Exception("User not found: " + to);
        
        await Groups.RemoveFromGroupAsync(toConnectionId, privateGroupName);
    }
    
    private async Task DisplayOnlineUsers()
    {
        List<string> onlineUsers = _chatService.GetUsers();
        await Clients.Groups("ChatApp").SendAsync("OnlineUsers", onlineUsers);
    }

    private string getPrivateGroupName(string from, string to)
    {
        var stringCompare = string.CompareOrdinal(from, to) < 0;
        return stringCompare ? $"{from}-{to}" : $"{to}-{from}";
    }
}
