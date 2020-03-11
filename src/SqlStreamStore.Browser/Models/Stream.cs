using System;

namespace SqlStreamStore.Browser
{
    public class StreamResponse
    {
        public long Position { get; set; }
        public DateTime CreatedUtc;
        public Guid MessageId;
        public string JsonMetadata;
        public int StreamVersion;
        public string StreamId;
        public string Type;
    }

    public class StreamMessageResponse
    {
       public long Position;
        public DateTime CreatedUtc;
        public Guid MessageId;
        public string JsonMetadata;
        public int StreamVersion;
        public string StreamId;
        public string Type;
        public string JsonData;
    }
}
