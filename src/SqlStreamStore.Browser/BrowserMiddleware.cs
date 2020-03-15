using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
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
            var currentNamespace = typeof(BrowserStartup).Namespace;
            string currentDir = Path.GetDirectoryName(currentAssembly.Location);
            
            var staticFilesDir = Path.Combine(currentDir, "../../../../sqlstreamstore.ui/build");

            return builder
                
                .UseStaticFiles(new StaticFileOptions()
                {
                    FileProvider = new EmbeddedFileProvider(currentAssembly, currentNamespace),
                    
                })
                .UseMvc()
                .Map("", innerBuilder =>
                {
                    innerBuilder.Run(async (context) =>
                    {
                        var resourceStream = currentAssembly.GetManifestResourceStream($"{currentNamespace}.index.html");
                        using (var reader = new StreamReader(resourceStream))
                        {
                            var html = reader.ReadToEnd();
                            html = html
                                .Replace("<head>", $"<head><base href=\"{context.Request.PathBase}/\" />");
                                // .Replace("<head>", $"<head><meta name=\"basename\" content=\"{context.Request.PathBase}\" />");
                            context.Response.ContentType = "text/html; charset=UTF-8";
                            await context.Response.WriteAsync(html);
                        }                        
                    });
                });
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
