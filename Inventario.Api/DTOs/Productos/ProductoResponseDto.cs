namespace Inventario.Api.DTOs.Productos;

public class ProductoResponseDto
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public string SKU { get; set; } = string.Empty;

    public decimal Precio { get; set; }

    public int Stock { get; set; }

    public int StockMinimo { get; set; }

    public bool Activo { get; set; }

    public int CategoriaId { get; set; }

    public string CategoriaNombre { get; set; } = string.Empty;

    public DateTime FechaCreacion { get; set; }

    public DateTime FechaActualizacion { get; set; }
}