namespace Inventario.Api.DTOs.Categorias;

public class CategoriaUpdateDto
{
    public string Nombre { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public bool Activa { get; set; }
}