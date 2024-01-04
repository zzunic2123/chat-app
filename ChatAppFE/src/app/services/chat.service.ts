import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {Observable} from "rxjs";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {Message} from "../models/message";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PrivateChatComponent} from "../private-chat/private-chat.component";

@Injectable({
  providedIn: 'root',
})


export class ChatService {
  myName: string = '';
  private chatConnection?: HubConnection;
  onlineUsers: string[] = [];
  messages: Message[] = [];
  privateMessages: Message[] = [];
  privateMessageInitiated = false;
  constructor(private httpClient: HttpClient, private modalService: NgbModal ) { }

  registerUser(user: User) {
    return this.httpClient.post(`http://localhost:5202/api/Chat/RegisterUser`, user, {responseType: 'text'})
  }

  createChatConnection(){
    this.chatConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(`http://localhost:5202/hubs/chat`).withAutomaticReconnect().build();

    console.log(this.chatConnection.state)

    this.chatConnection.start().catch(error => {
        // Handle connection errors here.
        console.log(error);
      });

    console.log(this.chatConnection.state)

    this.chatConnection.on('UserConnected', () =>{
      this.addUserConnectionId()
    })

    this.chatConnection.on('OnlineUsers', (onlineUsers) => {
      this.onlineUsers = [...onlineUsers];
    });

    this.chatConnection.on('NewMessage', (newMessage: Message) => {
      this.messages = [...this.messages, newMessage];
    });

    this.chatConnection.on('OpenPrivateChat', (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage];
      this.privateMessageInitiated = true;
      const modalRef = this.modalService.open(PrivateChatComponent);
      modalRef.componentInstance.toUser = newMessage.from;
    });

    this.chatConnection.on('NewPrivateMessage', (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage];
    });

    this.chatConnection.on('ClosePrivateChat', () => {
      this.privateMessageInitiated = false;
      this.privateMessages = [];
      this.modalService.dismissAll();
    });

    console.log(this.chatConnection.state)

  }

  stopChatConnection() {
    this.chatConnection?.stop().catch(error =>
    {
      console.log(error)
    })

    console.log("connection stopped user: " + this.myName)
  }

  async addUserConnectionId(){
    console.log("added connection id: " + this.myName)
    return this.chatConnection?.invoke('AddUserConnectionId', this.myName)
      .catch(error => console.log(error));
  }

  async sendMessage(content: string){
    const message: Message = {
      from: this.myName,
      content
    };

    return this.chatConnection?.invoke('ReceiveMessage', message)
      .then(() => console.log("message sent from user " + this.myName))
      .catch(error => console.log(error))
  }

  async sendPrivateMessage(to: string, content: string){
    const message: Message = {
      from: this.myName,
      to,
      content
    };
    console.log("[4] sending private message from: " + this.myName + " to: " + to)
    if (!this.privateMessageInitiated){
      this.privateMessageInitiated = true;
      return this.chatConnection?.invoke('CreatePrivateChat ', message)
        .then(() => {
          this.privateMessages = [...this.privateMessages, message]
        })
        .catch(error => console.log(error))
    } else {
      return this.chatConnection?.invoke('ReceivePrivateMessage ', message)
        .catch(error => console.log(error))
    }

  }

  async closePrivateChatMessage(otherUser: string){
    return this.chatConnection?.invoke('RemovePrivateChat', this.myName, otherUser)
      .then(() => console.log("closed private chat"))
      .catch(error => console.log(error));
  }

}

