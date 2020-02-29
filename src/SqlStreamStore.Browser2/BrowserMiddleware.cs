using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

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
            
            var staticFilesDir = Path.Combine(Directory.GetCurrentDirectory(), "../sqlstreamstore.ui/build/static");

            return builder
                .UseStaticFiles(new StaticFileOptions()
                {
                    FileProvider = new PhysicalFileProvider(staticFilesDir),
                    RequestPath = "/"
                })
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
