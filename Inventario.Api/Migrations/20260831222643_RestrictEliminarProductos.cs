using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventario.Api.Migrations
{
    /// <inheritdoc />
    public partial class RestrictEliminarProductos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_movimientos_inventario_productos_ProductoId",
                table: "movimientos_inventario");

            migrationBuilder.DropForeignKey(
                name: "FK_productos_categorias_CategoriaId",
                table: "productos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_productos",
                table: "productos");

            migrationBuilder.DropIndex(
                name: "IX_productos_SKU",
                table: "productos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_categorias",
                table: "categorias");

            migrationBuilder.DropPrimaryKey(
                name: "PK_movimientos_inventario",
                table: "movimientos_inventario");

            migrationBuilder.RenameTable(
                name: "productos",
                newName: "Productos");

            migrationBuilder.RenameTable(
                name: "categorias",
                newName: "Categorias");

            migrationBuilder.RenameTable(
                name: "movimientos_inventario",
                newName: "MovimientosInventario");

            migrationBuilder.RenameIndex(
                name: "IX_productos_CategoriaId",
                table: "Productos",
                newName: "IX_Productos_CategoriaId");

            migrationBuilder.RenameIndex(
                name: "IX_movimientos_inventario_ProductoId",
                table: "MovimientosInventario",
                newName: "IX_MovimientosInventario_ProductoId");

            migrationBuilder.AlterColumn<string>(
                name: "SKU",
                table: "Productos",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<decimal>(
                name: "Precio",
                table: "Productos",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Productos",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(150)",
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "Productos",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Categorias",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "Categorias",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Observaciones",
                table: "MovimientosInventario",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Motivo",
                table: "MovimientosInventario",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Productos",
                table: "Productos",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categorias",
                table: "Categorias",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MovimientosInventario",
                table: "MovimientosInventario",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MovimientosInventario_Productos_ProductoId",
                table: "MovimientosInventario",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Categorias_CategoriaId",
                table: "Productos",
                column: "CategoriaId",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MovimientosInventario_Productos_ProductoId",
                table: "MovimientosInventario");

            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Categorias_CategoriaId",
                table: "Productos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Productos",
                table: "Productos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Categorias",
                table: "Categorias");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MovimientosInventario",
                table: "MovimientosInventario");

            migrationBuilder.RenameTable(
                name: "Productos",
                newName: "productos");

            migrationBuilder.RenameTable(
                name: "Categorias",
                newName: "categorias");

            migrationBuilder.RenameTable(
                name: "MovimientosInventario",
                newName: "movimientos_inventario");

            migrationBuilder.RenameIndex(
                name: "IX_Productos_CategoriaId",
                table: "productos",
                newName: "IX_productos_CategoriaId");

            migrationBuilder.RenameIndex(
                name: "IX_MovimientosInventario_ProductoId",
                table: "movimientos_inventario",
                newName: "IX_movimientos_inventario_ProductoId");

            migrationBuilder.AlterColumn<string>(
                name: "SKU",
                table: "productos",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<decimal>(
                name: "Precio",
                table: "productos",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "productos",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "productos",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "categorias",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Descripcion",
                table: "categorias",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Observaciones",
                table: "movimientos_inventario",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Motivo",
                table: "movimientos_inventario",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_productos",
                table: "productos",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_categorias",
                table: "categorias",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_movimientos_inventario",
                table: "movimientos_inventario",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_productos_SKU",
                table: "productos",
                column: "SKU",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_movimientos_inventario_productos_ProductoId",
                table: "movimientos_inventario",
                column: "ProductoId",
                principalTable: "productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_productos_categorias_CategoriaId",
                table: "productos",
                column: "CategoriaId",
                principalTable: "categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
