namespace Inventario.Api.DTOs.Categorias;

public class CategoriaResponseDto
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public bool Activa { get; set; }

    public DateTime FechaCreacion { get; set; }
}