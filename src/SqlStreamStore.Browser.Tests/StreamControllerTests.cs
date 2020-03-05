namespace SqlStreamStore.Browser.Tests
{
    using Xunit;
    using SqlStreamStore.Browser.Controllers;
    using System.Linq;
    using SqlStreamStore.Streams;
    using System;

    public class StreamControllerTests
    {
        [Fact]
        public async void Should_return_stream_messages_where_last_appended_message_is_returned_first()
        {
            var streamStore = new InMemoryStreamStore();
            var streamMessageOne = new NewStreamMessage(Guid.NewGuid(), "firstMessage", "json data 1");
            var streamMessageTwo = new NewStreamMessage(Guid.NewGuid(), "secondMessage", "json data 2");
            var controller = new StreamsController(new FakeLogger<StreamsController>(), streamStore);
            
            await streamStore.AppendToStream(Guid.NewGuid().ToString(), ExpectedVersion.Any, streamMessageOne);
            await streamStore.AppendToStream(Guid.NewGuid().ToString(), ExpectedVersion.Any, streamMessageTwo);

            var result = await controller.Get();

            Assert.Equal(2, result.Count());
            Assert.Equal("secondMessage", result.Skip(0).First().Type);
            Assert.Equal("firstMessage", result.Skip(1).First().Type);
        }

        [Fact]
        public async void Should_return_only_the_last_100_messages()
        {
            var streamStore = new InMemoryStreamStore();
            var controller = new StreamsController(new FakeLogger<StreamsController>(), streamStore);

            for (int i = 1; i <= 150; i++)
            {
                var streamMessageOne = new NewStreamMessage(Guid.NewGuid(), $"message {i}", $"json data {i}");
                await streamStore.AppendToStream(Guid.NewGuid().ToString(), ExpectedVersion.Any, streamMessageOne);
            }

            var result = await controller.Get();

            Assert.Equal(100, result.Count());
            Assert.Equal("message 150", result.First().Type);
            Assert.Equal("message 51", result.Last().Type);
        }
    }
}
