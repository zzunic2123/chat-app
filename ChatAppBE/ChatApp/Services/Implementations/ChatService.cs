using System;
using System.Collections.Generic;
using System.Linq;
using ChatApp.Services.Interfaces;

namespace ChatApp.Services.Implementations;

public class ChatService : IChatService
{
    // This is a dictionary that will store the users and their connection ids
    private static Dictionary<string, string> _users;

    public ChatService()
    {
        _users = new Dictionary<string, string>();
    }

    public bool AddUserToDict(string user)
    {
        lock (_users)
        {
            string lowerCaseUser = user.ToLower();
            if (_users.ContainsKey(lowerCaseUser))
                return false;

            _users.Add(lowerCaseUser, null);
            return true;
        }
    }
    
    public bool AddConnectionIdToDict(string user, string connectionId)
    {
        lock (_users)
        {
            string userKey = user.ToLower();
            if (!_users.ContainsKey(userKey))
                return false;
            _users[userKey] = connectionId;
            return true;
        }
    }
    
    public string GetUserByConnectionId(string connectionId)
    {
        lock (_users)
        {
            return _users.FirstOrDefault(x => x.Value == connectionId).Key;
        }
    }

    public string GetConnectionIdByUser(string user)
    {
        lock (_users)
        {
            _users.TryGetValue(user.ToLower(), out string connectionId);
            return connectionId;
        }
    }
    
    public void RemoveUserFromDict(string user)
    {
        lock (_users)
        {
            _users.Remove(user.ToLower());
        }
    }
    
    public List<string> GetUsers()
    {
        lock (_users)
        {
            return _users.OrderBy(u => u.Key).Select(u => u.Key).ToList();
        }
    }

}