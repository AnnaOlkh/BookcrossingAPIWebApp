using Microsoft.AspNetCore.Mvc.ViewEngines;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace BookcrossingAPIWebApp.Models;

public class User : IdentityUser
{
    public User()
    {
        MyBooks = new List<BookCopy>();
        Reviews = new List<Review>();
    }
    [Key]
    public int Id { get; set; }
    [Required, MaxLength(100)]
    public string NickName { get; set; }
    public ICollection<BookCopy> MyBooks { get; set; }
    public ICollection<Review> Reviews { get; set; }
}
