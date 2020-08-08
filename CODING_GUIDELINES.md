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

### User roles and ownership guards

`auth` module has `/user-roles` directory where we keep logic that is responsible for everything related
to setting, configuring and guarding user roles. The ownership guards are placed in the same directory.
We can simply mark specific routes (ex. dashboard delete/update) and add check guards that will do the validation
(`ControllerAuth` decorator from `/auth/decorators` contains most common decorators for controllers)

```typescript
@ControllerAuth('dashboards', Dashboard)
@UseInterceptors(SerializerInterceptor)
export class DashboardsController {
  // ...
  @Roles(UserRole.REGULAR)
  @CheckOwnership()
  async updateDashboard() {}
}
```
