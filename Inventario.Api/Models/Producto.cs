namespace Inventario.Api.Models;

public class Producto
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public string SKU { get; set; } = string.Empty;

    public decimal Precio { get; set; }

    public int Stock { get; set; }

    public int StockMinimo { get; set; }

    public bool Activo { get; set; } = true;

    public int CategoriaId { get; set; }

    public Categoria Categoria { get; set; } = null!;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public DateTime FechaActualizacion { get; set; } = DateTime.UtcNow;

    public ICollection<MovimientoInventario> Movimientos { get; set; }
        = new List<MovimientoInventario>();
}