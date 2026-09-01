namespace Inventario.Api.DTOs.Productos;

public class InventarioResumenDto
{
    public int TotalProductos { get; set; }

    public int ProductosActivos { get; set; }

    public int ProductosInactivos { get; set; }

    public int ProductosStockBajo { get; set; }

    public int UnidadesEnStock { get; set; }

    public decimal ValorInventario { get; set; }
}