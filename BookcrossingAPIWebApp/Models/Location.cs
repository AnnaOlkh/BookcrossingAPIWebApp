using System.ComponentModel.DataAnnotations;

namespace BookcrossingAPIWebApp.Models;

public class Location
{
    public Location()
    {
        BookRoutes = new List<BookRoute>();
    }

    [Key]
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Country { get; set; }

    [MaxLength(100)]
    public string Region { get; set; }

    [MaxLength(100)]
    public string City { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; }
    public ICollection<BookRoute> BookRoutes { get; set; }
}
