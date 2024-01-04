using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models;

public class UserDto
{
    [Required]
    [StringLength(15, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 15 characters")]
    public string Name { get; set; }
}