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
        public async Task<IEnumerable<StreamResponse>> Get()
        {
            return (await _streamStore.ReadAllBackwards(Position.End, 100))
                .Messages.Select(message => new StreamResponse()
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
        public async Task<IEnumerable<StreamResponse>> GetByStreamId(string streamId)
        {
            return (await _streamStore.ReadStreamBackwards(new StreamId(streamId), StreamVersion.End, 10000))
                .Messages.Select(message => new StreamResponse()
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
        [Route("{streamid}/{messageId}")]
        public async Task<ActionResult<StreamMessageResponse>> GetMessageByStreamAndMessageId(string streamId, Guid messageId)
        {
            try
            {
                var stream = await _streamStore.ReadStreamBackwards(new StreamId(streamId), StreamVersion.End, 10000);
                var streamMessage = stream.Messages.FirstOrDefault(m => m.MessageId == messageId);
                
                if (streamMessage.Equals(default(StreamMessage))) {
                  return this.StatusCode(404);
                }
                
                return new StreamMessageResponse()
                {
                    StreamId = streamMessage.StreamId,
                    CreatedUtc = streamMessage.CreatedUtc,
                    MessageId = streamMessage.MessageId,
                    StreamVersion = streamMessage.StreamVersion,
                    Type = streamMessage.Type,
                    JsonData = await streamMessage.GetJsonData(),
                };
            }
            catch (Exception ex)
            {
              Console.WriteLine(ex.Message);
              return this.StatusCode(400);
            }
        }
    }
}
