using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace SqlStreamStore.Browser2
{
    public static class Browser2Startup
    {
        public static IApplicationBuilder UseSqlStreamStoreBrowser(
            this IApplicationBuilder builder
        )
        {
            if(builder == null)
                throw new ArgumentNullException(nameof(builder));

            return builder
                .UseMvc();
        }
        public static IServiceCollection AddSqlStreamStoreBrowser(
            this IServiceCollection serviceCollection,
            IStreamStore streamStore
        )
        {
            if(serviceCollection == null)
            {
                throw new ArgumentNullException(nameof(serviceCollection));
            }
            serviceCollection.AddSingleton(streamStore);
            serviceCollection.AddMvc();
            return serviceCollection;
        }
    }
}
