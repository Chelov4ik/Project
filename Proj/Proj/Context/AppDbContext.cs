using Microsoft.EntityFrameworkCore;
using Proj.Models;

namespace Proj.Context
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<MyTask> Tasks { get; set; } 
        public DbSet<News> News { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Конфигурация для RefreshToken
            modelBuilder.Entity<RefreshToken>()
                .HasKey(rt => rt.Id);

            modelBuilder.Entity<RefreshToken>()
                .Property(rt => rt.Token)
                .IsRequired();

            modelBuilder.Entity<RefreshToken>()
                .Property(rt => rt.Expiration)
                .IsRequired();

            modelBuilder.Entity<RefreshToken>()
                .Property(rt => rt.Username)
                .IsRequired();

            // Конфигурация для MyTask
            modelBuilder.Entity<MyTask>()
                .HasKey(t => t.Id); // Установка первичного ключа

            modelBuilder.Entity<MyTask>()
                .Property(t => t.Title)
                .IsRequired(); // Установка обязательного поля для названия задачи

            modelBuilder.Entity<MyTask>()
                .Property(t => t.Description)
                .IsRequired(); // Установка обязательного поля для описания задачи

            modelBuilder.Entity<MyTask>()
                .Property(t => t.IssuedDate)
                .IsRequired(); // Установка обязательного поля для даты выдачи задачи

            modelBuilder.Entity<MyTask>()
                .Property(t => t.Deadline)
                .IsRequired(); // Установка обязательного поля для дедлайна

            modelBuilder.Entity<MyTask>()
                .Property(t => t.Status)
                .IsRequired(); // Установка обязательного поля для статуса задачи

            modelBuilder.Entity<MyTask>()
                .Property(t => t.Priority)
                .IsRequired(); // Установка обязательного поля для приоритета задачи


            modelBuilder.Entity<News>()
            .HasKey(n => n.Id); // Установка первичного ключа

            modelBuilder.Entity<News>()
                .Property(n => n.Title)
                .IsRequired()
                .HasMaxLength(200); // Обязательное поле с максимальной длиной 200 символов

            modelBuilder.Entity<News>()
                .Property(n => n.Content)
                .IsRequired(); // Обязательное поле для содержания 

            modelBuilder.Entity<News>()
                .Property(n => n.PublishedDate)
                .IsRequired()
                .HasDefaultValueSql("GETDATE()"); // Обязательное поле с текущей датой по умолчанию

        }
    }
}
