using System;
using System.IO;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

namespace SqlStreamStore.Browser
{
    public static class BrowserStartup
    {
        public static IApplicationBuilder UseSqlStreamStoreBrowser(
            this IApplicationBuilder builder
        )
        {
            if(builder == null)
                throw new ArgumentNullException(nameof(builder));
            
            var currentAssembly = System.Reflection.Assembly.GetAssembly(typeof(BrowserStartup));
            string currentDir = Path.GetDirectoryName(currentAssembly.Location);
            
            var staticFilesDir = Path.Combine(currentDir, "../../../../sqlstreamstore.ui/build");

            return builder
                .UseDefaultFiles(new DefaultFilesOptions()
                {
                    FileProvider = new EmbeddedFileProvider(currentAssembly, "SqlStreamStore.Browser"),
                })
                .UseStaticFiles(new StaticFileOptions()
                {
                    FileProvider = new EmbeddedFileProvider(currentAssembly, "SqlStreamStore.Browser"),
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
