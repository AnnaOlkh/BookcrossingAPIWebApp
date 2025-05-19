using System.ComponentModel.DataAnnotations;

namespace BookcrossingAPIWebApp.Models;
public class Review
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int AuthorId { get; set; }
    public User Author { get; set; }

    [Required]
    public int BookId { get; set; }
    public Book Book { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    public string Comment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
