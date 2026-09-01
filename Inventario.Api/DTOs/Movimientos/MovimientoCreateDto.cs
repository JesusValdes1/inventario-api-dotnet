using Inventario.Api.Models;

namespace Inventario.Api.DTOs.Movimientos;

public class MovimientoCreateDto
{
    public int ProductoId { get; set; }

    public TipoMovimiento Tipo { get; set; }

    public int Cantidad { get; set; }

    public string Motivo { get; set; } = string.Empty;

    public string? Observaciones { get; set; }
}