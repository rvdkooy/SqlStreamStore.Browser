using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
// using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Routing;

namespace SqlStreamStore.Browser2
{
    public static class Browser2Startup
    {
        public static IApplicationBuilder UseSqlStreamStoreBrowser(
            this IApplicationBuilder builder
            // IStreamStore streamStore,
            // SqlStreamStoreMiddlewareOptions options = default
        )
        {
            if(builder == null)
                throw new ArgumentNullException(nameof(builder));
            // if(streamStore == null)
            //     throw new ArgumentNullException(nameof(streamStore));

            return builder
                // .UseExceptionHandling()
                .UseMvc();
                    // .MapMiddlewareRoute(
                    //     Constants.Paths.AllStream,
                    //     inner => inner.UseAllStream(allStream))
                    // .MapMiddlewareRoute(
                    //     $"{Constants.Paths.AllStream}/{{position:long}}",
                    //     inner => inner.UseAllStreamMessage(allStreamMessages))
                    // .MapMiddlewareRoute(
                    //     Constants.Paths.Streams,
                    //     inner => inner.UseStreamBrowser(streamBrowser))
                    // .MapMiddlewareRoute(
                    //     $"{Constants.Paths.Streams}/{{streamId}}",
                    //     inner => inner.UseStreams(streams))
                    // .MapMiddlewareRoute(
                    //     $"{Constants.Paths.Streams}/{{streamId}}/{Constants.Paths.Metadata}",
                    //     inner => inner.UseStreamMetadata(streamMetadata))
                    // .MapMiddlewareRoute(
                    //     $"{Constants.Paths.Streams}/{{streamId}}/{{p}}",
                    //     inner => inner.UseStreamMessages(streamMessages))
                    // .MapMiddlewareRoute(
                    //     string.Empty,
                    //     inner => inner.UseIndex(index)));
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
