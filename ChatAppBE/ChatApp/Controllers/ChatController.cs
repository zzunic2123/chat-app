using System.Collections.Generic;
using System.Net;
using ChatApp.Models;
using ChatApp.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;

[ApiController]
[Route("api/[Controller]/[Action]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(string),(int) HttpStatusCode.OK)]
    [ProducesResponseType(typeof(string),(int) HttpStatusCode.BadRequest)]
    public IActionResult RegisterUser(UserDto user)
    {
        if (!_chatService.AddUserToDict(user.Name))
            return BadRequest("User already exists");
        
        return Ok("User registered");
    }
    
    [HttpGet]
    [ProducesResponseType(typeof(IList<string>),(int) HttpStatusCode.OK)]
    public IActionResult GetUsers()
    {
        return Ok(_chatService.GetUsers());
    }
    
}