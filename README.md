# SqlStreamStore.Browser

<span>ASP.NET</span> core UI to browse a SqlStreamStore.

<img style="border: 1px solid;max-width:75%" src="docs/dashboard_screen.png" alt="Screenshot of SqlStreamStore dashboard">

## installation

Nuget:

``` shell
dotnet package add SqlStreamStore.Browser
```


Startup
``` dotnet

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseSqlStreamStoreBrowser(streamStoreInstance);
}

public void ConfigureServices(IServiceCollection services)
{
    services.AddSqlStreamStoreBrowser();
}

```

Start your webapp.


## development

Running the development environment you have to start 2 processes:

dotnet core devserver (includes SqlStreamStore.HAL):

``` shell
cd src/SqlStreamStore.Browser.DevServer
dotnet run
```

node webpack devserver (build with [react-create-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app)):

``` javascript
cd src/sqlstreamstore.ui
yarn start
```

Enjoy!
