import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../models/message";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  @Input() messages: Message[] = []

  constructor() {
  }

  ngOnInit() {
  }

}
