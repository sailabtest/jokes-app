import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private http:Http) { }
  private ApiUrl = environment.url;  // URL to web api 
  
  static prepareJsonHeader(){    
    let headers = new Headers({ 'Content-Type': 'application/json' });
	  let options = new RequestOptions({ headers: headers });
    return options;
  }
  
  static isJSON(data) {
    var ret = false;
    try {
     return JSON.parse(data);
    }catch(e) {
       ret = false;
    }
    return ret;
 }
 
 static prepareResponse(isPass, yourMsg, output){	
    return {pass: isPass, msg: yourMsg, body: output};
 }

 static extractData(res: Response) {
  var output = res.text();
  var customMsg = "";
  var isPass = false;
  let jsonFormat = HelperService.isJSON(output);
  let result = ""; 

  if (jsonFormat) {
    if(jsonFormat === true){ //invalid format
        customMsg = "Invalid JSON fromat";  
    
    }else if(jsonFormat.status){ //pass
        customMsg = jsonFormat.message;
        isPass = true;
        result = jsonFormat.obj;
    
    }else{ //not pass 
        customMsg	= jsonFormat.message;	
    
    }

  }else{
    customMsg = "Invalid data format. Should be JSON";
    console.log("-not JSON format-");
    console.log(res);	
    
    result		= output;	
  }

  //this.result = res.json();
  return HelperService.prepareResponse(isPass, customMsg, result);
}

  callGet(part){  
    console.log("part: ", part)   
        let options = HelperService.prepareJsonHeader();
        let authenticate = {auth:"somefakeauthforjokes"};
        let params = JSON.stringify(authenticate);
        let url = this.ApiUrl+part+"&authenticate="+params;   
        console.log("url: ", url)   
        return this.http.get(url, options).toPromise()
        .then(HelperService.extractData);
  }
  callPost(actionName: string, value: any){  
        let options = HelperService.prepareJsonHeader();
        let authenticate = {auth:"somefakeauthforjokes", data: value};
        let params = JSON.stringify(authenticate);     
        return this.http.post(this.ApiUrl+actionName, params, options).toPromise()
        .then(HelperService.extractData);
  }

}
