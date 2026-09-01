namespace Inventario.Api.DTOs.Categorias;

public class CategoriaCreateDto
{
    public string Nombre { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public bool Activa { get; set; } = true;
}