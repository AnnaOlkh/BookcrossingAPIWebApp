using System.ComponentModel.DataAnnotations;

namespace BookcrossingAPIWebApp.Models;

public class BookCopy
{
    public BookCopy()
    {
        Route = new List<BookRoute>();
        Code = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        IsAvailable = true;
    }

    [Key]
    public int Id { get; set; }

    [Required, MaxLength(50)]
    public string Code { get; set; }

    [Required]
    public int BookId { get; set; }
    public Book Book { get; set; }
    public int? CurrentLocationId { get; set; }
    public Location CurrentLocation { get; set; }
    public int? CurrentHolderId { get; set; }
    public User CurrentHolder { get; set; }

    public bool IsAvailable { get; set; }
    public ICollection<BookRoute> Route { get; set; }
}
