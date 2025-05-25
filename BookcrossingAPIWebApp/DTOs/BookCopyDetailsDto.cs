namespace BookcrossingAPIWebApp.DTOs;

public class BookCopyDetailsDto
{
    public string Code { get; set; }
    public bool IsAvailable { get; set; }

    // book info
    public string Title { get; set; }
    public string Author { get; set; }
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public int PageCount { get; set; }

    public int? CurrentLocationId { get; set; }
    public string CurrentLocationName { get; set; }

    // route (optional)
    public List<string> Route { get; set; }
}
