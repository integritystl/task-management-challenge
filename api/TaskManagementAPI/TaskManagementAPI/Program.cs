using MediatR;
using TaskManagement.Core.Queries;
using TaskManagement.Infrastructure;
using TaskManagementAPI.Util;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register repository
builder.Services.AddTransient<ITaskRepository, TaskRepository>();

// Register MediatR
builder.Services.AddMediatR(m => m.RegisterServicesFromAssembly(typeof(TaskListQueryHandler).Assembly));

builder.Services.AddAutoMapper(typeof(MappingProfile));
 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowCors", policy =>
    {
        policy.AllowAnyOrigin()  
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Build the application
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors("AllowCors");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
