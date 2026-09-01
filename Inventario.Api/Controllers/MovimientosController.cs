using Inventario.Api.Data;
using Inventario.Api.DTOs.Movimientos;
using Inventario.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventario.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MovimientosController : ControllerBase
{
    private readonly InventarioDbContext _context;

    public MovimientosController(InventarioDbContext context)
    {
        _context = context;
    }

    // GET: api/Movimientos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MovimientoResponseDto>>> GetMovimientos()
    {
        var movimientos = await _context.MovimientosInventario
            .AsNoTracking()
            .Include(m => m.Producto)
            .OrderByDescending(m => m.Fecha)
            .Select(m => new MovimientoResponseDto
            {
                Id = m.Id,
                ProductoId = m.ProductoId,
                ProductoNombre = m.Producto.Nombre,
                SKU = m.Producto.SKU,
                Tipo = m.Tipo,
                Cantidad = m.Cantidad,
                Motivo = m.Motivo,
                Observaciones = m.Observaciones,
                Fecha = m.Fecha
            })
            .ToListAsync();

        return Ok(movimientos);
    }

    // GET: api/Movimientos/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<MovimientoResponseDto>> GetMovimiento(int id)
    {
        var movimiento = await _context.MovimientosInventario
            .AsNoTracking()
            .Include(m => m.Producto)
            .Where(m => m.Id == id)
            .Select(m => new MovimientoResponseDto
            {
                Id = m.Id,
                ProductoId = m.ProductoId,
                ProductoNombre = m.Producto.Nombre,
                SKU = m.Producto.SKU,
                Tipo = m.Tipo,
                Cantidad = m.Cantidad,
                Motivo = m.Motivo,
                Observaciones = m.Observaciones,
                Fecha = m.Fecha
            })
            .FirstOrDefaultAsync();

        if (movimiento is null)
        {
            return NotFound(new
            {
                mensaje = "El movimiento no existe."
            });
        }

        return Ok(movimiento);
    }

    // POST: api/Movimientos
    [HttpPost]
    public async Task<ActionResult<MovimientoResponseDto>> CrearMovimiento(
        MovimientoCreateDto dto)
    {
        if (dto.Cantidad <= 0)
        {
            return BadRequest(new
            {
                mensaje = "La cantidad debe ser mayor que cero."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.Motivo))
        {
            return BadRequest(new
            {
                mensaje = "El motivo del movimiento es obligatorio."
            });
        }

        var producto = await _context.Productos
            .FirstOrDefaultAsync(p => p.Id == dto.ProductoId);

        if (producto is null)
        {
            return NotFound(new
            {
                mensaje = "El producto no existe."
            });
        }

        // ENTRADA
        if (dto.Tipo == TipoMovimiento.Entrada)
        {
            producto.Stock += dto.Cantidad;
        }

        // SALIDA
        else if (dto.Tipo == TipoMovimiento.Salida)
        {
            if (dto.Cantidad > producto.Stock)
            {
                return Conflict(new
                {
                    mensaje = $"No hay stock suficiente. Stock disponible: {producto.Stock}."
                });
            }

            producto.Stock -= dto.Cantidad;
        }

        // AJUSTE
        else if (dto.Tipo == TipoMovimiento.Ajuste)
        {
            producto.Stock = dto.Cantidad;
        }

        var movimiento = new MovimientoInventario
        {
            ProductoId = producto.Id,
            Tipo = dto.Tipo,
            Cantidad = dto.Cantidad,
            Motivo = dto.Motivo.Trim(),
            Observaciones = string.IsNullOrWhiteSpace(dto.Observaciones)
                ? null
                : dto.Observaciones.Trim(),
            Fecha = DateTime.UtcNow
        };

        producto.FechaActualizacion = DateTime.UtcNow;

        _context.MovimientosInventario.Add(movimiento);

        await _context.SaveChangesAsync();

        var response = new MovimientoResponseDto
        {
            Id = movimiento.Id,
            ProductoId = producto.Id,
            ProductoNombre = producto.Nombre,
            SKU = producto.SKU,
            Tipo = movimiento.Tipo,
            Cantidad = movimiento.Cantidad,
            Motivo = movimiento.Motivo,
            Observaciones = movimiento.Observaciones,
            Fecha = movimiento.Fecha
        };

        return CreatedAtAction(
            nameof(GetMovimiento),
            new { id = movimiento.Id },
            response);
    }
}