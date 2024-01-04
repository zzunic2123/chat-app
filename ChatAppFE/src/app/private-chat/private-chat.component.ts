import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ChatService} from "../services/chat.service";
import {MessagesComponent} from "../messages/messages.component";
import {ChatInputComponent} from "../chat-input/chat-input.component";

@Component({
  selector: 'app-private-chat',
  standalone: true,
  imports: [
    MessagesComponent,
    ChatInputComponent
  ],
  templateUrl: './private-chat.component.html',
  styleUrl: './private-chat.component.css'
})
export class PrivateChatComponent implements OnInit, OnDestroy{
  @Input() toUser = '';

  constructor(public activeModal: NgbActiveModal, public chatService: ChatService) {
  }

  ngOnInit() {
    console.log("[2] private chat component ngoninit from user" + this.chatService.myName)
    console.log(this.chatService)
  }

  ngOnDestroy() {
    console.log("private chat component ngondestroy")
    this.chatService.closePrivateChatMessage(this.toUser)
  }

  sendMessage(content: string){
    console.log("[3]send private message in private.chat component")
    this.chatService.sendPrivateMessage(this.toUser, content)
  }
}
