﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookcrossingAPIWebApp.Models;
using BookcrossingAPIWebApp.DTOs;

namespace BookcrossingAPIWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookCopiesController : ControllerBase
    {
        private readonly BookcrossingAPIContext _context;

        public BookCopiesController(BookcrossingAPIContext context)
        {
            _context = context;
        }

        // GET: api/BookCopies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookCopyListDto>>> GetBookCopies()
        {
            var copies = await _context.BookCopies
                .Where(bc => bc.IsAvailable)
                .Include(bc => bc.Book)
                .Select(bc => new BookCopyListDto
                {
                    Code = bc.Code,
                    Title = bc.Book.Title,
                    Author = bc.Book.Author,
                    CoverImageUrl = bc.Book.CoverImageUrl,
                    IsAvailable = bc.IsAvailable
                })
                .ToListAsync();

            return copies;
        }


        [HttpGet("by-code/{code}")]
        public async Task<ActionResult<BookCopyDetailsDto>> GetByCode(string code)
        {
            var bookCopy = await _context.BookCopies
                .Include(bc => bc.Book)
                .Include(bc => bc.Route).ThenInclude(r => r.Location)
                .FirstOrDefaultAsync(b => b.Code == code.ToUpper());

            if (bookCopy == null)
                return NotFound();

            var currentLocation = bookCopy.CurrentLocationId.HasValue
                ? await _context.Locations.FindAsync(bookCopy.CurrentLocationId)
                : null;

            var dto = new BookCopyDetailsDto
            {
                Code = bookCopy.Code,
                IsAvailable = bookCopy.IsAvailable,
                Title = bookCopy.Book.Title,
                Author = bookCopy.Book.Author,
                Description = bookCopy.Book.Description,
                CoverImageUrl = bookCopy.Book.CoverImageUrl,
                PageCount = bookCopy.Book.PageCount,
                CurrentLocationId = bookCopy.CurrentLocationId,
                CurrentLocationName = currentLocation != null
                    ? $"{currentLocation.Name}, {currentLocation.City}, {currentLocation.Country}"
                    : null,
                Route = bookCopy.Route
                    .OrderBy(r => r.VisitedAt)
                    .Select(r => $"{r.Location.Name} ({r.VisitedAt:yyyy-MM-dd})")
                    .ToList()
            };

            return dto;
        }
        [HttpPost]
        public async Task<ActionResult<BookCopy>> AddBookCopy(AddBookCopyDto dto)
        {
            var title = dto.Title.Trim().ToLower();
            var author = dto.Author.Trim().ToLower();

            var existingBook = await _context.Books
                .FirstOrDefaultAsync(b =>
                    b.Title.ToLower() == title &&
                    b.Author.ToLower() == author);

            if (existingBook == null)
            {
                existingBook = new Book
                {
                    Title = dto.Title,
                    Author = dto.Author,
                    Description = dto.Description,
                    CoverImageUrl = dto.CoverImageUrl,
                    PageCount = dto.PageCount
                };

                _context.Books.Add(existingBook);
                await _context.SaveChangesAsync();
            }

            var bookCopy = new BookCopy
            {
                BookId = existingBook.Id,
                IsAvailable = true
            };

            _context.BookCopies.Add(bookCopy);
            await _context.SaveChangesAsync();

            if (dto.LocationId.HasValue)
            {
                var route = new BookRoute
                {
                    BookCopyId = bookCopy.Id,
                    LocationId = dto.LocationId.Value,
                    VisitedAt = DateTime.Now
                };

                _context.BookRoutes.Add(route);
                await _context.SaveChangesAsync();
            }

            return Ok(new { code = bookCopy.Code });
        }
        [HttpPost("change-location")]
        public async Task<IActionResult> ChangeLocation([FromBody] ChangeLocationDto dto)
        {
            var bookCopy = await _context.BookCopies
                .FirstOrDefaultAsync(bc => bc.Code == dto.Code);

            if (bookCopy == null)
                return NotFound("Копію книги не знайдено!");

            bookCopy.CurrentLocationId = dto.LocationId;
            bookCopy.IsAvailable = true;

            var bookRoute = new BookRoute
            {
                BookCopyId = bookCopy.Id,
                LocationId = dto.LocationId,
                VisitedAt = DateTime.Now
            };
            _context.BookRoutes.Add(bookRoute);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpPost("pickup")]
        public async Task<IActionResult> PickupBook([FromBody] PickupBookDto dto)
        {
            var bookCopy = await _context.BookCopies
                .FirstOrDefaultAsync(bc => bc.Code == dto.Code);

            if (bookCopy == null)
                return NotFound("Копію книги не знайдено!");
            bookCopy.CurrentLocationId = null;
            bookCopy.IsAvailable = false;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/BookCopies/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookCopy(int id, BookCopy bookCopy)
        {
            if (id != bookCopy.Id)
            {
                return BadRequest();
            }

            _context.Entry(bookCopy).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookCopyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/BookCopies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookCopy(int id)
        {
            var bookCopy = await _context.BookCopies.FindAsync(id);
            if (bookCopy == null)
            {
                return NotFound();
            }

            _context.BookCopies.Remove(bookCopy);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookCopyExists(int id)
        {
            return _context.BookCopies.Any(e => e.Id == id);
        }
    }
}
