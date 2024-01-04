import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ChatService} from "../services/chat.service";
import {ChatComponent} from "../chat/chat.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [ChatService]
})

export class HomeComponent {
  userForm: FormGroup = new FormGroup({});
  submitted = false;
  apiErrorMessage: string = '';
  openChat = false;

  constructor(private formBuilder: FormBuilder, private chatService:ChatService) {
  }

  ngOnInit(){
    this.initializeForm();
  }
  initializeForm()
  {
    this.userForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
      }
    )
  }

  submitForm(){
    this.submitted = true;
    this.apiErrorMessage = '';
    if(this.userForm.valid)
    {
      this.chatService.registerUser(this.userForm.value).subscribe({
        next: () =>
        {
          this.chatService.myName = this.userForm.get('name')?.value;
          this.openChat = true;
          this.userForm.reset();
          this.submitted = false;
        },
        error: error => {
          if(typeof(error.error) !== 'object'){
            this.apiErrorMessage = error.error.toString()
          }
        }
      })
    }
  }

  closeChat(){
    this.openChat = false;
  }
}
