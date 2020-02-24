namespace SqlStreamStore.Browser2.DevServer
{
    using System;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.DependencyInjection;

    internal class DevServerStartup : IStartup
    {
        private readonly IStreamStore _streamStore;
        // private readonly SqlStreamStoreMiddlewareOptions _options;

        public DevServerStartup(
            IStreamStore streamStore
            // SqlStreamStoreMiddlewareOptions options
        )
        {
            _streamStore = streamStore;
            // _options = options;
        }

        public IServiceProvider ConfigureServices(IServiceCollection services) => services
            .AddSqlStreamStoreBrowser(this._streamStore)
            .BuildServiceProvider();

        public void Configure(IApplicationBuilder app) => app
            .UseSqlStreamStoreBrowser();
    }
}