using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookcrossingAPIWebApp.Models;

public class Book
{
    public Book()
    {
        BookCopies = new List<BookCopy>();
        Reviews = new List<Review>();
        BookTags = new List<BookTag>();
    }

    [Key]
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; }

    [MaxLength(150)]
    public string Author { get; set; }
    public string Description { get; set; }
    [MaxLength(2048)]
    public string CoverImageUrl { get; set; }

    public int PageCount { get; set; }
    public ICollection<BookCopy> BookCopies { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public ICollection<BookTag> BookTags { get; set; } = new List<BookTag>();
    [NotMapped]
    public IEnumerable<Tag> Tags => BookTags.Select(bt => bt.Tag);
}
