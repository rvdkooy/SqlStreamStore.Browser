using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using SqlStreamStore.Streams;

namespace SqlStreamStore.Browser.Controllers
{
    [ApiController]
    [Route("/api/streams")]
    public class StreamsController : ControllerBase
    {
        private readonly ILogger<StreamsController> _logger;

        private readonly IStreamStore _streamStore;
        public StreamsController(ILogger<StreamsController> logger, IStreamStore streamStore)
        {
            _logger = logger;
            _streamStore = streamStore;
        }

        [HttpGet]
        public async Task<IEnumerable<Stream>> Get()
        {
            return (await _streamStore.ReadAllBackwards(Position.End, 100))
                .Messages.Select(message => new Stream()
                {
                    StreamId = message.StreamId,
                    CreatedUtc = message.CreatedUtc,
                    MessageId = message.MessageId,
                    StreamVersion = message.StreamVersion,
                    Type = message.Type,
                })
                .ToArray();
        }

        [HttpGet]
        [Route("{streamid}")]
        public async Task<IEnumerable<Stream>> GetByStreamId(string streamId)
        {
            Console.WriteLine(streamId);
            return (await _streamStore.ReadStreamBackwards(new StreamId(streamId), StreamVersion.End, 10000))
                .Messages.Select(message => new Stream()
                {
                    StreamId = message.StreamId,
                    CreatedUtc = message.CreatedUtc,
                    MessageId = message.MessageId,
                    StreamVersion = message.StreamVersion,
                    Type = message.Type,
                })
                .ToArray();
        }
    }
}
