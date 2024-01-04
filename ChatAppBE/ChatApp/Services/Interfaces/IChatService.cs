using System.Collections.Generic;

namespace ChatApp.Services.Interfaces;

public interface IChatService
{
    public bool AddUserToDict(string user);
    public bool AddConnectionIdToDict(string user, string connectionId);
    public string GetUserByConnectionId(string connectionId);
    public string GetConnectionIdByUser(string user);
    public void RemoveUserFromDict(string user);
    public List<string> GetUsers();
}