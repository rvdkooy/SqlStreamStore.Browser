using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;
using SqlStreamStore.Streams;

namespace SqlStreamStore.Browser.DevServer
{
    internal class Program : IDisposable
    {
        private static readonly Random s_random = new Random();
        private readonly CancellationTokenSource _cts;
        private readonly IConfiguration _configuration;

        public static async Task<int> Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .CreateLogger();

            using(var program = new Program(args))
            {
                return await program.Run();
            }
        }

        private Program(string[] args)
        {
            _cts = new CancellationTokenSource();
            _configuration = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .AddCommandLine(args)
                .Build();
        }

        private async Task<int> Run()
        {
            try
            {
                using(var streamStore = new InMemoryStreamStore())
                using(var host = new WebHostBuilder()
                    .UseKestrel()
                    .UseStartup(new DevServerStartup(streamStore))
                    .UseSerilog()
                    .Build())
                {
                    Write(streamStore, 20, 10);
                    
                    var serverTask = host.RunAsync(_cts.Token);

                    await serverTask;

                    return 0;
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message +  " Host terminated unexpectedly.");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        private static void Write(IStreamStore streamStore, int messageCount, int streamCount)
        {
            var streams = Enumerable.Range(0, streamCount).Select(_ => $"test-{Guid.NewGuid():n}").ToList();

            Task.Run(() => Task.WhenAll(
                from streamId in streams
                select streamStore.AppendToStream(
                    streamId,
                    ExpectedVersion.NoStream,
                    GenerateMessages(messageCount))));
        }

        private static NewStreamMessage[] GenerateMessages(int messageCount)
            => Enumerable.Range(0, messageCount)
                .Select(_ => new NewStreamMessage(
                    Guid.NewGuid(),
                    "test",
                    $@"{{ ""foo"": ""{Guid.NewGuid()}"", ""baz"": {{  }}, ""qux"": [ {
                            string.Join(", ",
                                Enumerable
                                    .Range(0, messageCount).Select(max => s_random.Next(max)))
                        } ] }}",
                    "{}"))
                .ToArray();
        public void Dispose()
        {
            _cts?.Dispose();
        }
    }
}
