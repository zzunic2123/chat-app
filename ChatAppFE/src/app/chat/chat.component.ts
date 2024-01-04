import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ChatService} from "../services/chat.service";
import {NgClass, NgForOf} from "@angular/common";
import {ChatInputComponent} from "../chat-input/chat-input.component";
import {sendMessage} from "@microsoft/signalr/dist/esm/Utils";
import {MessagesComponent} from "../messages/messages.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PrivateChatComponent} from "../private-chat/private-chat.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    ChatInputComponent,
    MessagesComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy{

  @Output() closeChatEmitter = new EventEmitter();
  constructor(public chatService: ChatService, private modalService: NgbModal) {
  }

  ngOnInit(): void{
    this.chatService.createChatConnection();

  }

  ngOnDestroy(): void {
    this.chatService.stopChatConnection();
  }

  backToHome(){
    this.closeChatEmitter.emit();
  }

  sendMessage(content: string){
    this.chatService.sendMessage(content);
  }

  openPrivateChat(toUser: string){
    console.log("[1] opened private chat in chat.component.ts from user:" + this.chatService.myName)
    console.log(this.chatService)
    const modalRef = this.modalService.open(PrivateChatComponent);
    modalRef.componentInstance.toUser = toUser;
  }

}
