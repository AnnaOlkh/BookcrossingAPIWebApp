using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookcrossingAPIWebApp.Migrations
{
    /// <inheritdoc />
    public partial class Mess : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ISBN",
                table: "Books");

            migrationBuilder.AddColumn<int>(
                name: "CurrentLocationId",
                table: "BookCopies",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BookCopies_CurrentLocationId",
                table: "BookCopies",
                column: "CurrentLocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_BookCopies_Locations_CurrentLocationId",
                table: "BookCopies",
                column: "CurrentLocationId",
                principalTable: "Locations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookCopies_Locations_CurrentLocationId",
                table: "BookCopies");

            migrationBuilder.DropIndex(
                name: "IX_BookCopies_CurrentLocationId",
                table: "BookCopies");

            migrationBuilder.DropColumn(
                name: "CurrentLocationId",
                table: "BookCopies");

            migrationBuilder.AddColumn<string>(
                name: "ISBN",
                table: "Books",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }
    }
}
