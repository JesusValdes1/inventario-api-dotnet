namespace Inventario.Api.Models;

public class MovimientoInventario
{
    public int Id { get; set; }

    public int ProductoId { get; set; }

    public Producto Producto { get; set; } = null!;

    public TipoMovimiento Tipo { get; set; }

    public int Cantidad { get; set; }

    public string Motivo { get; set; } = string.Empty;

    public string? Observaciones { get; set; }

    public DateTime Fecha { get; set; } = DateTime.UtcNow;
}