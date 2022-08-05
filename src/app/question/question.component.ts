import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public name : string = "User";
  public questionList : any[] = [];
  public currentQuestion : number = 0;
  public points : number = 0;
  public timer : number = 60;
  public correctAns : number = 0;
  public incorrectAns : number = 0;
  public interval$ : any;
  public progress : string = "0";
  public isQuizCompleted : boolean = false;

  constructor(private questionServ : QuestionService) { }

  ngOnInit(): void {
    this.name = sessionStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionServ.getQuestionJson().subscribe(
      res => {  
        this.questionList = res.questions;
      }
    )
  }

  nextQuestion(){
    this.currentQuestion++;
  }

  previousQuestion(){
    this.currentQuestion--;
  }

  answer(questionNo : number, option : any){

    if(questionNo === this.questionList.length){
      this.isQuizCompleted = true;
      if(option.correct){
        this.points += 10;
        this.correctAns++;
      }else{
        this.points -= 10;
        this.incorrectAns++;
      }
      this.stopCounter();
    }else{
      if(option.correct){
        this.points += 10;
        this.correctAns++;
        setTimeout(() => {
          this.currentQuestion++;
          this.resetCounter();
          this.getProgressPercent();
        }, 1000);
      }else{
        this.points -= 10;
        this.incorrectAns++;
        setTimeout(() => {
          this.currentQuestion++;
          this.resetCounter();
          this.getProgressPercent();
        }, 1000);
      }
    }

    
  }

  startCounter(){
    this.interval$ = interval(1000).subscribe(
      val => {
        this.timer--;
        if(this.timer==0){
          this.currentQuestion++;
          this.points -= 10;
          this.timer = 60;
        }
      }
    );

    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }

  stopCounter(){
    this.interval$.unsubscribe();
    this.timer = 0;
  }

  resetCounter(){
    this.stopCounter();
    this.timer = 60;
    this.startCounter();
  }

  resetQuiz(){
    this.correctAns = 0;
    this.incorrectAns = 0;
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.currentQuestion = 0;
    this.progress = "0";
  }

  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }

}
