using System;

namespace SqlStreamStore.Browser2
{
    public class Stream
    {
        public long Position { get; set; }
        public DateTime CreatedUtc;
        public Guid MessageId;
        public string JsonMetadata;
        public int StreamVersion;
        public string StreamId;
        public string Type;
    }
}
