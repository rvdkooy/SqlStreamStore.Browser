export const getStreams = async (streamId?: string) => {
  let url = '/api/streams';
  if (streamId) {
    url += '/' + streamId;
  }
  
  const resp = await fetch(url);
  const streams = await resp.json();
  return streams.map((s: any) => StreamResponse.fromJson(s))
};

export const getMessage = async (streamId: string, messageId: string) => {
  const resp = await fetch(`/api/streams/${streamId}/${messageId}`);
  const message = await resp.json();
  return StreamMessage.fromJson(message);
}

export class StreamMessage {
  constructor (public streamId: string, public messageId: string, public createdUtc: string, 
    public streamVersion: string, public type: string, public position: number, public jsonData: string) {
  }
  
  static fromJson (json: any) {
    return new StreamMessage(json.streamId, json.messageId, json.createdUtc,
      json.streamVersion, json.type, json.position, json.jsonData);
  }
};

export class StreamResponse {
  constructor (public streamId: string, public messageId: string, public createdUtc: string, 
    public streamVersion: string, public type: string, public position: number) {
  }
  
  static fromJson (json: any) {
    return new StreamResponse(json.streamId, json.messageId, json.createdUtc,
      json.streamVersion, json.type, json.position);
  }
};

export default {
  getStreams,
  getMessage,
};
