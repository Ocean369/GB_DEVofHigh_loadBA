import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';

import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';


export interface DataMessage{
  userName: string;
  text: string;
  timestamp: Date;
}

export interface ChatInfo{
  [key:number] : string
  }

  export interface ChatMessages{
    [key:number] : DataMessage[]
  }

export interface MessageAddChat {
  chatname:string;
  message:DataMessage;
}

import Redis from "ioredis";
import { OnEvent } from '@nestjs/event-emitter';

const redisClient = new Redis();

@WebSocketGateway(8001,{
  //transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');


   // событие срабатывает после инициализации сервера
   afterInit(server: Server) {
    this.logger.log('Init');
  }
  // событие срабатывает после каждого отключения клиента
  handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
  }
  // событие срабатывает после каждого подключения клиента
  async handleConnection(client: Socket, ...args: any[]) {
      const { chatId } = client.handshake.query;
      client.join(chatId);
      this.logger.log(`Client connected: ${client.id}`);

      const existingChats:string[] =  await redisClient.lrange('chat_list',0,-1) || [];
      const _chat = existingChats[Number(chatId)];
      const existingMessages = await redisClient.lrange(_chat, 0, -1);
      this.server.to(chatId).emit("historical_messages", existingMessages.map((item) => JSON.parse(item)));
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body):void {
    console.log('idChat',body)
    redisClient.rpush(body[0], JSON.stringify(body[1]));
    this.server.to(body[2]).emit('message',body[0],body[1],body[2]);
  }
}
