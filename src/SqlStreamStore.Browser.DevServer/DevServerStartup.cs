namespace SqlStreamStore.Browser.DevServer
{
    using System;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.DependencyInjection;

    internal class DevServerStartup : IStartup
    {
        private readonly IStreamStore _streamStore;

        public DevServerStartup(
            IStreamStore streamStore
        )
        {
            _streamStore = streamStore;
        }

        public IServiceProvider ConfigureServices(IServiceCollection services) => services
            .AddSqlStreamStoreBrowser(this._streamStore)
            .BuildServiceProvider();

        public void Configure(IApplicationBuilder app) => app
            .UseSqlStreamStoreBrowser();
    }
}