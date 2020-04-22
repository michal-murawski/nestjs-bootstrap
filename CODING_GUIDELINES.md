### Naming

###### 1. Response/Request/Data DTO

Examples:

```
    class GetDashboardResponseDTO {
        data: Serialize<GetDashboardDataDTO>
    }

    class GetDashboardRequestDTO {
        id: string;
    }

    class GetDashboardDataDTO {
        id: string;
        name: string;
    }


    // Usage example
    @Get()
    getDashboard(@Body() getDashboardRequestDTO: GetDashboardRequestDTO): Promise<GetDashboardResponseDTO> {
        cosnt dashboard = (...)
        return {
            data: this.userSerializationService.markSerializableValue(dashboard),
        }
    }

    function return :

```

Every response has `data` key which contains a specific entity we requested for.
`Serialize` wrapper is required for our `SerializationInterceptor` and `serialization services`.

###### 2. Controllers and services methods

Try to keep them the same or very similar.

### Naming

See the example inside dashboard module. Simple logging for service, controller and repository.
