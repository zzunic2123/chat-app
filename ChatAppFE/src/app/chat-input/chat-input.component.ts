import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {sendMessage} from "@microsoft/signalr/dist/esm/Utils";

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
  content: string = '';
  @Output() contentEmitter = new EventEmitter();
  constructor() {
  }

  sendMessage(){
    if(this.content.trim() !== ""){
      this.contentEmitter.emit(this.content);
    }

    this.content = '';
  }
}
