using Inventario.Api.Models;

namespace Inventario.Api.DTOs.Movimientos;

public class MovimientoResponseDto
{
    public int Id { get; set; }

    public int ProductoId { get; set; }

    public string ProductoNombre { get; set; } = string.Empty;

    public string SKU { get; set; } = string.Empty;

    public TipoMovimiento Tipo { get; set; }

    public int Cantidad { get; set; }

    public string Motivo { get; set; } = string.Empty;

    public string? Observaciones { get; set; }

    public DateTime Fecha { get; set; }
}