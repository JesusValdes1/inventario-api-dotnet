using System.ComponentModel.DataAnnotations;

namespace Inventario.Api.DTOs.Productos;

public class ProductoUpdateDto
{
    [Required(ErrorMessage = "El nombre del producto es obligatorio.")]
    [StringLength(150, MinimumLength = 2,
        ErrorMessage = "El nombre debe tener entre 2 y 150 caracteres.")]
    public string Nombre { get; set; } = string.Empty;

    [StringLength(500,
        ErrorMessage = "La descripción no puede superar los 500 caracteres.")]
    public string? Descripcion { get; set; }

    [Required(ErrorMessage = "El SKU del producto es obligatorio.")]
    [StringLength(50, MinimumLength = 2,
        ErrorMessage = "El SKU debe tener entre 2 y 50 caracteres.")]
    public string SKU { get; set; } = string.Empty;

    [Range(0, double.MaxValue,
        ErrorMessage = "El precio no puede ser negativo.")]
    public decimal Precio { get; set; }

    [Range(0, int.MaxValue,
        ErrorMessage = "El stock mínimo no puede ser negativo.")]
    public int StockMinimo { get; set; }

    public bool Activo { get; set; }

    [Range(1, int.MaxValue,
        ErrorMessage = "La categoría es obligatoria.")]
    public int CategoriaId { get; set; }
}