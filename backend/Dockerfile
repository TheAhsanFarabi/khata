FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["AssignmentSystem.sln", "./"]
COPY ["AssignmentSystem.API/AssignmentSystem.API.csproj", "AssignmentSystem.API/"]
COPY ["AssignmentSystem.Tests/AssignmentSystem.Tests.csproj", "AssignmentSystem.Tests/"]

# Restore dependencies
RUN dotnet restore

# Copy the rest of the code
COPY . .

# Build and publish the API
WORKDIR "/src/AssignmentSystem.API"
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Generate runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AssignmentSystem.API.dll"]
