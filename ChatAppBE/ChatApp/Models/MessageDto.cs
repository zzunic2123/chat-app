﻿using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models;

public class MessageDto
{
    [Required]
    public string From { get; set; }
    public string To { get; set; }
    [Required]
    public string Content { get; set; }
}