namespace SqlStreamStore.Browser.Tests {

    using System;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.DependencyInjection;
    using Xunit.Abstractions;

    internal class TestStartup : IStartup
    {
        private readonly IStreamStore _streamStore;

        public TestStartup(IStreamStore streamStore = null)
        {
            _streamStore = streamStore;
        }

        public IServiceProvider ConfigureServices(IServiceCollection services) {
            if (this._streamStore != null)
            {
                services.AddSingleton(this._streamStore);
            }
            return services
                .AddSqlStreamStoreBrowser()
                .BuildServiceProvider();
        }

        public void Configure(IApplicationBuilder app) => app
            .UseSqlStreamStoreBrowser();
    }
}