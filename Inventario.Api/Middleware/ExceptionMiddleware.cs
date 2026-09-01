using System.Net;
using System.Text.Json;

namespace Inventario.Api.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var traceId = context.TraceIdentifier;

            _logger.LogError(
                ex,
                "Error no controlado. TraceId: {TraceId}",
                traceId);

            if (context.Response.HasStarted)
            {
                _logger.LogWarning(
                    "La respuesta ya había comenzado. No se puede modificar el código HTTP. TraceId: {TraceId}",
                    traceId);

                throw;
            }

            context.Response.StatusCode =
                (int)HttpStatusCode.InternalServerError;

            context.Response.ContentType = "application/json";

            var response = new
            {
                statusCode = context.Response.StatusCode,
                mensaje = "Ocurrió un error interno en el servidor.",
                traceId = traceId
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));
        }
    }
}