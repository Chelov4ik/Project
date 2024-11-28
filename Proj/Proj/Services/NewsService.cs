using Microsoft.EntityFrameworkCore;
using Proj.Context;
using Proj.Models;

namespace Proj.Services
{
    public class NewsService : INewsService
    {
        private readonly AppDbContext _context;

        public NewsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<News>> GetAllAsync()
        {
            return await _context.News.ToListAsync();
        }

        public async Task<News?> GetByIdAsync(int id)
        {
            return await _context.News.FindAsync(id);
        }

        public async Task<News> CreateAsync(News news)
        {
            _context.News.Add(news);
            await _context.SaveChangesAsync();
            return news;
        }

        public async Task<News?> UpdateAsync(int id, News news)
        {
            var existingNews = await _context.News.FindAsync(id);
            if (existingNews == null) return null;

            existingNews.Title = news.Title;
            existingNews.Content = news.Content;
            existingNews.PublishedDate = news.PublishedDate;

            await _context.SaveChangesAsync();
            return existingNews;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null) return false;

            _context.News.Remove(news);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
