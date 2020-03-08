export interface Stream {
  messageId: string;
  createdUtc: string;
  streamVersion: string;
  streamId: string;
  type: string;
  position: number
};
