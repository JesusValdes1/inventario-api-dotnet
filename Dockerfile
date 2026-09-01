FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["Inventario.Api/Inventario.Api.csproj", "Inventario.Api/"]
RUN dotnet restore "Inventario.Api/Inventario.Api.csproj"

COPY . .
WORKDIR "/src/Inventario.Api"

RUN dotnet publish "Inventario.Api.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Inventario.Api.dll"]