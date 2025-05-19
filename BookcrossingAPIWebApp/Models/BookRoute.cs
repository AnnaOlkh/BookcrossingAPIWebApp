using System.ComponentModel.DataAnnotations;

namespace BookcrossingAPIWebApp.Models;

public class BookRoute
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int BookCopyId { get; set; }
    public BookCopy BookCopy { get; set; }

    [Required]
    public int LocationId { get; set; }
    public Location Location { get; set; }

    public DateTime VisitedAt { get; set; } = DateTime.Now;
}
