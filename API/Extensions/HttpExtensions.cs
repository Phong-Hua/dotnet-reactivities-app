using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    // Add pagination header to response
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage,
            int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };
            //Serializse JSON sendback
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
            // explicitly expose it so browser can read it
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination"); // spelling is IMPORTANT
            
        }
    }
}