import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  @ViewChild('name') nameKey! : ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  startQuiz(){
    sessionStorage.setItem("name", this.nameKey.nativeElement.value);
  }

}
