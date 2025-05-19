using System.ComponentModel.DataAnnotations;

namespace BookcrossingAPIWebApp.Models;

public class BookTag
{
    [Required]
    public int BookId { get; set; }
    public Book Book { get; set; }

    [Required]
    public int TagId { get; set; }
    public Tag Tag { get; set; }
}
