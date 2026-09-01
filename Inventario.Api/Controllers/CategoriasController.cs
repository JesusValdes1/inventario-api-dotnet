using Inventario.Api.Data;
using Inventario.Api.DTOs.Categorias;
using Inventario.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventario.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly InventarioDbContext _context;

    public CategoriasController(InventarioDbContext context)
    {
        _context = context;
    }

    // GET: api/Categorias
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoriaResponseDto>>> GetCategorias()
    {
        var categorias = await _context.Categorias
            .AsNoTracking()
            .Select(c => new CategoriaResponseDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                Activa = c.Activa,
                FechaCreacion = c.FechaCreacion
            })
            .ToListAsync();

        return Ok(categorias);
    }

    // GET: api/Categorias/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoriaResponseDto>> GetCategoria(int id)
    {
        var categoria = await _context.Categorias
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new CategoriaResponseDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                Activa = c.Activa,
                FechaCreacion = c.FechaCreacion
            })
            .FirstOrDefaultAsync();

        if (categoria is null)
        {
            return NotFound(new
            {
                mensaje = "La categoría no existe."
            });
        }

        return Ok(categoria);
    }

    // POST: api/Categorias
    [HttpPost]
    public async Task<ActionResult<CategoriaResponseDto>> CrearCategoria(
        CategoriaCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
        {
            return BadRequest(new
            {
                mensaje = "El nombre de la categoría es obligatorio."
            });
        }

        var nombreExiste = await _context.Categorias
            .AnyAsync(c => c.Nombre.ToLower() == dto.Nombre.Trim().ToLower());

        if (nombreExiste)
        {
            return Conflict(new
            {
                mensaje = "Ya existe una categoría con ese nombre."
            });
        }

        var categoria = new Categoria
        {
            Nombre = dto.Nombre.Trim(),
            Descripcion = string.IsNullOrWhiteSpace(dto.Descripcion)
                ? null
                : dto.Descripcion.Trim(),
            Activa = dto.Activa
        };

        _context.Categorias.Add(categoria);

        await _context.SaveChangesAsync();

        var response = new CategoriaResponseDto
        {
            Id = categoria.Id,
            Nombre = categoria.Nombre,
            Descripcion = categoria.Descripcion,
            Activa = categoria.Activa,
            FechaCreacion = categoria.FechaCreacion
        };

        return CreatedAtAction(
            nameof(GetCategoria),
            new { id = categoria.Id },
            response);
    }

    // PUT: api/Categorias/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> ActualizarCategoria(
        int id,
        CategoriaUpdateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
        {
            return BadRequest(new
            {
                mensaje = "El nombre de la categoría es obligatorio."
            });
        }

        var categoria = await _context.Categorias
            .FirstOrDefaultAsync(c => c.Id == id);

        if (categoria is null)
        {
            return NotFound(new
            {
                mensaje = "La categoría no existe."
            });
        }

        var nombreExiste = await _context.Categorias
            .AnyAsync(c =>
                c.Id != id &&
                c.Nombre.ToLower() == dto.Nombre.Trim().ToLower());

        if (nombreExiste)
        {
            return Conflict(new
            {
                mensaje = "Ya existe otra categoría con ese nombre."
            });
        }

        categoria.Nombre = dto.Nombre.Trim();

        categoria.Descripcion = string.IsNullOrWhiteSpace(dto.Descripcion)
            ? null
            : dto.Descripcion.Trim();

        categoria.Activa = dto.Activa;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Categorias/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarCategoria(int id)
    {
        var categoria = await _context.Categorias
            .Include(c => c.Productos)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (categoria is null)
        {
            return NotFound(new
            {
                mensaje = "La categoría no existe."
            });
        }

        if (categoria.Productos.Any())
        {
            return Conflict(new
            {
                mensaje = "No se puede eliminar la categoría porque tiene productos asociados."
            });
        }

        _context.Categorias.Remove(categoria);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}