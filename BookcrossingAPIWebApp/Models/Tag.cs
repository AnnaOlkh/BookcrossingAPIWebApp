using System.ComponentModel.DataAnnotations;

namespace BookcrossingAPIWebApp.Models;

public class Tag
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; }

    public ICollection<BookTag> BookTags { get; set; } = new List<BookTag>();
}
