using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Xunit;

namespace SqlStreamStore.Browser.Tests
{
    public class StartupTests
    {
        [Fact]
        public void Should_throw_when_no_streamstore_instance_is_registered()
        {
            var builder = new WebHostBuilder();
            builder.ConfigureServices(services => services
                .AddSingleton<IStartup>(new TestStartup()));

            var exception = Assert.Throws<NullReferenceException>(() => new TestServer(builder));
            Assert.Equal("No StreamStore instance found.", exception.Message);
        }

        [Fact]
        public void Should_startup_if_set_up_correctly()
        {
            var streamStore = new InMemoryStreamStore();

            var builder = new WebHostBuilder();
            builder.ConfigureServices(services => services
                .AddSingleton<IStartup>(new TestStartup(streamStore)));

            var exception = Record.Exception(() => new TestServer(builder));
            Assert.Null(exception);
        }

        [Fact]
        public async void Should_serve_hal_endpoints()
        {
            var streamStore = new InMemoryStreamStore();

            var builder = new WebHostBuilder();
            builder.ConfigureServices(services => services
                .AddSingleton<IStartup>(new TestStartup(streamStore)));

            var server = new TestServer(builder);
            var client = server.CreateClient();

            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri("http://localhost/hal"),
                Method = HttpMethod.Get,
            };
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/hal+json"));

            var halResponse = await client.SendAsync(request);
            var content = await halResponse.Content.ReadAsStringAsync();
            Assert.Equal(HttpStatusCode.OK, halResponse.StatusCode);
            Assert.Contains("provider", content);
            Assert.Contains("InMemory", content);
        }

        [Fact]
        public async void Should_serve_the_main_index()
        {
            var streamStore = new InMemoryStreamStore();

            var builder = new WebHostBuilder();
            builder.ConfigureServices(services => services
                .AddSingleton<IStartup>(new TestStartup(streamStore)));

            var server = new TestServer(builder);
            var client = server.CreateClient();

           
            var halResponse = await client.GetAsync("");
            var content = await halResponse.Content.ReadAsStringAsync();
            Assert.Equal(HttpStatusCode.OK, halResponse.StatusCode);
            Assert.Contains("!doctype html", content);
        }
    }
}
