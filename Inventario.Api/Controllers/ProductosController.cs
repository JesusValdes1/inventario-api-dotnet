using Inventario.Api.Data;
using Inventario.Api.DTOs.Productos;
using Inventario.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventario.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly InventarioDbContext _context;

    public ProductosController(InventarioDbContext context)
    {
        _context = context;
    }

    // GET: api/Productos
    [HttpGet]
    public async Task<ActionResult<PagedResponseDto<ProductoResponseDto>>> GetProductos(
        [FromQuery] string? nombre,
        [FromQuery] string? sku,
        [FromQuery] int? categoriaId,
        [FromQuery] bool? activo,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string sortBy = "id",
        [FromQuery] string sortOrder = "asc")
    {
        if (page < 1)
        {
            return BadRequest(new
            {
                mensaje = "El número de página debe ser mayor o igual a 1."
            });
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest(new
            {
                mensaje = "El tamaño de página debe estar entre 1 y 100."
            });
        }

        var query = _context.Productos
            .AsNoTracking()
            .Include(p => p.Categoria)
            .AsQueryable();

        // Filtro por nombre
        if (!string.IsNullOrWhiteSpace(nombre))
        {
            var nombreBusqueda = nombre.Trim().ToLower();

            query = query.Where(p =>
                p.Nombre.ToLower().Contains(nombreBusqueda));
        }

        // Filtro por SKU
        if (!string.IsNullOrWhiteSpace(sku))
        {
            var skuBusqueda = sku.Trim().ToLower();

            query = query.Where(p =>
                p.SKU.ToLower().Contains(skuBusqueda));
        }

        // Filtro por categoría
        if (categoriaId.HasValue)
        {
            query = query.Where(p =>
                p.CategoriaId == categoriaId.Value);
        }

        // Filtro por estado
        if (activo.HasValue)
        {
            query = query.Where(p =>
                p.Activo == activo.Value);
        }

        // Ordenamiento
        sortBy = sortBy.Trim().ToLower();
        sortOrder = sortOrder.Trim().ToLower();

        query = sortBy switch
        {
            "nombre" => sortOrder == "desc"
                ? query.OrderByDescending(p => p.Nombre)
                : query.OrderBy(p => p.Nombre),

            "sku" => sortOrder == "desc"
                ? query.OrderByDescending(p => p.SKU)
                : query.OrderBy(p => p.SKU),

            "precio" => sortOrder == "desc"
                ? query.OrderByDescending(p => p.Precio)
                : query.OrderBy(p => p.Precio),

            "stock" => sortOrder == "desc"
                ? query.OrderByDescending(p => p.Stock)
                : query.OrderBy(p => p.Stock),

            "stockminimo" => sortOrder == "desc"
                ? query.OrderByDescending(p => p.StockMinimo)
                : query.OrderBy(p => p.StockMinimo),

            "fechacreacion" => sortOrder == "desc"
                ? query.OrderByDescending(p => p.FechaCreacion)
                : query.OrderBy(p => p.FechaCreacion),

            "fechaactualizacion" => sortOrder == "desc"
                ? query.OrderByDescending(p => p.FechaActualizacion)
                : query.OrderBy(p => p.FechaActualizacion),

            "id" => sortOrder == "desc"
                ? query.OrderByDescending(p => p.Id)
                : query.OrderBy(p => p.Id),

            _ => query.OrderBy(p => p.Id)
        };

        var totalItems = await query.CountAsync();

        var totalPages = (int)Math.Ceiling(
            totalItems / (double)pageSize);

        var productos = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductoResponseDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                SKU = p.SKU,
                Precio = p.Precio,
                Stock = p.Stock,
                StockMinimo = p.StockMinimo,
                Activo = p.Activo,
                CategoriaId = p.CategoriaId,
                CategoriaNombre = p.Categoria.Nombre,
                FechaCreacion = p.FechaCreacion,
                FechaActualizacion = p.FechaActualizacion
            })
            .ToListAsync();

        var response = new PagedResponseDto<ProductoResponseDto>
        {
            Items = productos,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };

        return Ok(response);
    }

    // GET: api/Productos/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductoResponseDto>> GetProducto(int id)
    {
        var producto = await _context.Productos
            .AsNoTracking()
            .Include(p => p.Categoria)
            .Where(p => p.Id == id)
            .Select(p => new ProductoResponseDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                SKU = p.SKU,
                Precio = p.Precio,
                Stock = p.Stock,
                StockMinimo = p.StockMinimo,
                Activo = p.Activo,
                CategoriaId = p.CategoriaId,
                CategoriaNombre = p.Categoria.Nombre,
                FechaCreacion = p.FechaCreacion,
                FechaActualizacion = p.FechaActualizacion
            })
            .FirstOrDefaultAsync();

        if (producto is null)
        {
            return NotFound(new
            {
                mensaje = "El producto no existe."
            });
        }

        return Ok(producto);
    }

    // POST: api/Productos
    [HttpPost]
    public async Task<ActionResult<ProductoResponseDto>> CrearProducto(
        ProductoCreateDto dto)
    {
        var categoriaExiste = await _context.Categorias
            .AnyAsync(c => c.Id == dto.CategoriaId);

        if (!categoriaExiste)
        {
            return BadRequest(new
            {
                mensaje = "La categoría especificada no existe."
            });
        }

        var skuNormalizado = dto.SKU.Trim();

        var skuExiste = await _context.Productos
            .AnyAsync(p => p.SKU.ToLower() == skuNormalizado.ToLower());

        if (skuExiste)
        {
            return Conflict(new
            {
                mensaje = "Ya existe un producto con ese SKU."
            });
        }

        var producto = new Producto
        {
            Nombre = dto.Nombre.Trim(),
            Descripcion = string.IsNullOrWhiteSpace(dto.Descripcion)
                ? null
                : dto.Descripcion.Trim(),
            SKU = skuNormalizado,
            Precio = dto.Precio,
            Stock = dto.Stock,
            StockMinimo = dto.StockMinimo,
            Activo = dto.Activo,
            CategoriaId = dto.CategoriaId,
            FechaCreacion = DateTime.UtcNow,
            FechaActualizacion = DateTime.UtcNow
        };

        _context.Productos.Add(producto);

        await _context.SaveChangesAsync();

        var response = await _context.Productos
            .AsNoTracking()
            .Include(p => p.Categoria)
            .Where(p => p.Id == producto.Id)
            .Select(p => new ProductoResponseDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                SKU = p.SKU,
                Precio = p.Precio,
                Stock = p.Stock,
                StockMinimo = p.StockMinimo,
                Activo = p.Activo,
                CategoriaId = p.CategoriaId,
                CategoriaNombre = p.Categoria.Nombre,
                FechaCreacion = p.FechaCreacion,
                FechaActualizacion = p.FechaActualizacion
            })
            .FirstAsync();

        return CreatedAtAction(
            nameof(GetProducto),
            new { id = producto.Id },
            response);
    }

    // PUT: api/Productos/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> ActualizarProducto(
        int id,
        ProductoUpdateDto dto)
    {
        var producto = await _context.Productos
            .FirstOrDefaultAsync(p => p.Id == id);

        if (producto is null)
        {
            return NotFound(new
            {
                mensaje = "El producto no existe."
            });
        }

        var categoriaExiste = await _context.Categorias
            .AnyAsync(c => c.Id == dto.CategoriaId);

        if (!categoriaExiste)
        {
            return BadRequest(new
            {
                mensaje = "La categoría especificada no existe."
            });
        }

        var skuNormalizado = dto.SKU.Trim();

        var skuExiste = await _context.Productos
            .AnyAsync(p =>
                p.Id != id &&
                p.SKU.ToLower() == skuNormalizado.ToLower());

        if (skuExiste)
        {
            return Conflict(new
            {
                mensaje = "Ya existe otro producto con ese SKU."
            });
        }

        producto.Nombre = dto.Nombre.Trim();

        producto.Descripcion = string.IsNullOrWhiteSpace(dto.Descripcion)
            ? null
            : dto.Descripcion.Trim();

        producto.SKU = skuNormalizado;
        producto.Precio = dto.Precio;
        producto.StockMinimo = dto.StockMinimo;
        producto.Activo = dto.Activo;
        producto.CategoriaId = dto.CategoriaId;
        producto.FechaActualizacion = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/Productos/stock-bajo
    [HttpGet("stock-bajo")]
    public async Task<ActionResult<IEnumerable<ProductoResponseDto>>> GetProductosStockBajo()
    {
        var productos = await _context.Productos
            .AsNoTracking()
            .Include(p => p.Categoria)
            .Where(p => p.Stock <= p.StockMinimo)
            .Select(p => new ProductoResponseDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                SKU = p.SKU,
                Precio = p.Precio,
                Stock = p.Stock,
                StockMinimo = p.StockMinimo,
                Activo = p.Activo,
                CategoriaId = p.CategoriaId,
                CategoriaNombre = p.Categoria.Nombre,
                FechaCreacion = p.FechaCreacion,
                FechaActualizacion = p.FechaActualizacion
            })
            .ToListAsync();

        return Ok(productos);
    }

    // GET: api/Productos/resumen
    [HttpGet("resumen")]
    public async Task<ActionResult<InventarioResumenDto>> GetResumenInventario()
    {
        var totalProductos = await _context.Productos
            .CountAsync();

        var productosActivos = await _context.Productos
            .CountAsync(p => p.Activo);

        var productosInactivos = totalProductos - productosActivos;

        var productosStockBajo = await _context.Productos
            .CountAsync(p => p.Stock <= p.StockMinimo);

        var unidadesEnStock = await _context.Productos
            .SumAsync(p => p.Stock);

        var valorInventario = await _context.Productos
            .SumAsync(p => p.Precio * p.Stock);

        var resumen = new InventarioResumenDto
        {
            TotalProductos = totalProductos,
            ProductosActivos = productosActivos,
            ProductosInactivos = productosInactivos,
            ProductosStockBajo = productosStockBajo,
            UnidadesEnStock = unidadesEnStock,
            ValorInventario = valorInventario
        };

        return Ok(resumen);
    }

    // DELETE: api/Productos/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarProducto(int id)
    {
        var producto = await _context.Productos
            .Include(p => p.Movimientos)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (producto is null)
        {
            return NotFound(new
            {
                mensaje = "El producto no existe."
            });
        }

        if (producto.Movimientos.Any())
        {
            return Conflict(new
            {
                mensaje = "No se puede eliminar el producto porque tiene movimientos de inventario asociados."
            });
        }

        _context.Productos.Remove(producto);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}