import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HelperService }	from '../../service/helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public Helper: HelperService) { }

  //populate this with the list of jokes
  JokesList: any = false;
  searching: any      = '';
  searchingFormControl: any;

  showAlert: any = false;

  //new joke content
  JokeName: any = '';
  JokeType: any = '';
  //selected joke 
  SelectedJoke: any = false;

  //error message
  ErrorMsg: any = false;

  ngOnInit() {
      //on default load jokes
      this.getJokes();
      
      //on keypress in search box search in Jokes list for joke
      this.searchingFormControl = new FormControl({value: this.searching, disabled: false});
      this.searchingFormControl.valueChanges.subscribe((selectedValue) => {
          this.searchBox(selectedValue);
      });
  }

  getJokes(){
    this.Helper.callGet('?').then((res) => {
      console.log("data is: ", res);
      if(res.pass && res.body){        
        this.JokesList = res.body;
      }
    }).catch((e) => {
      this.ErrorMsg = e;
      console.log("data error: ", e);
    })
  }

  addJoke(){
    if(!this.JokeName){
      this.ErrorMsg = "Please type in joke with valid length no longer than 500 chars!"
    }else if(this.JokeType && this.JokeType.length > 25){
      this.ErrorMsg = "The length of Joke type can't be longer than 25 chars!"
    }else{
      //all ok
      console.log("ok");
      this.Helper.callPost("add_joke", {JokeName: this.JokeName, JokeType: this.JokeType}).then((res) => {
        console.log("res is: ", res);
        if(res.pass){
          this.getJokes();   
          //hid joke box
          this.showAlert = false; 
          this.JokeName = ''; 
          this.JokeType = ''; 

        }else{
          this.ErrorMsg = res.msg;
        }

      }).catch((e) => {
        console.log("res error: ", e);
        this.ErrorMsg = e;
      })
    }

  }

  updateJoke(){
    //we do the rest of validation for this function on the backend
    if(!this.SelectedJoke){
      this.ErrorMsg = "No joke selected!"
    }else{
      //all ok
      console.log("ok");
      this.Helper.callPost("update_joke", this.SelectedJoke).then((res) => {
        console.log("res is: ", res);
        if(res.pass){
          this.getJokes();   
          //hid joke box
          this.showAlert = false; 
          this.SelectedJoke = false;

        }else{
          this.ErrorMsg = res.msg;
        }

      }).catch((e) => {
        console.log("res error update: ", e);
        this.ErrorMsg = e;
      })
    }

  }

  deleteJoke(){
    //we do the rest of validation for this function on the backend
    if(!this.SelectedJoke){
      this.ErrorMsg = "No joke selected!"
    }else{
      //all ok
      console.log("ok");
      this.Helper.callPost("remove_joke", this.SelectedJoke).then((res) => {
        console.log("res is: ", res);
        if(res.pass){
          this.getJokes();   
          //hid joke box
          this.showAlert = false; 
          this.SelectedJoke = false;

        }else{
          this.ErrorMsg = res.msg;
        }

      }).catch((e) => {
        console.log("res error update: ", e);
        this.ErrorMsg = e;
      })
    }

  }

  searchBox(value: string) {
    this.searching = value;
    if(!this.searching) return;
    console.log("searching: ", value);  
    
    this.Helper.callPost('search', {value: value}).then((res) => {
      console.log("data is: ", res);
      if(res.pass && res.body){        
        this.JokesList = res.body;
      }
    }).catch((e) => {
      this.ErrorMsg = e;
      console.log("data error: ", e);
    })

  }

}
