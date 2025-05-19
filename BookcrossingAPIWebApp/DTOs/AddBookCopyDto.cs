namespace BookcrossingAPIWebApp.DTOs
{
    public class AddBookCopyDto
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public string? Description { get; set; }
        public string? CoverImageUrl { get; set; }
        public int PageCount { get; set; }
        public int? LocationId { get; set; }
    }
}
