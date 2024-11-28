using Microsoft.AspNetCore.Mvc;
using Proj.Models;
using Proj.Services;

namespace Proj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController : ControllerBase
    {
        private readonly INewsService _newsService;

        public NewsController(INewsService newsService)
        {
            _newsService = newsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var news = await _newsService.GetAllAsync();
            return Ok(news);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var news = await _newsService.GetByIdAsync(id);
            if (news == null)
                return NotFound();
            return Ok(news);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] News news)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdNews = await _newsService.CreateAsync(news);
            return CreatedAtAction(nameof(GetById), new { id = createdNews.Id }, createdNews);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] News news)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedNews = await _newsService.UpdateAsync(id, news);
            if (updatedNews == null)
                return NotFound();

            return Ok(updatedNews);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _newsService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
