namespace BookcrossingAPIWebApp.DTOs;

public class BookCopyListDto
{
    public string Code { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public string CoverImageUrl { get; set; }
    public bool IsAvailable { get; set; }
}
