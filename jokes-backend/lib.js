
const { Jokes } 	= require('./sequelize');
const { Op } 		= require("sequelize");

/**
 * This is just Lib class will hold our core classes for the Jokes app. 
 */
class Lib{
  constructor() {}

    static makeResponse(status, msg, obj){
        let response = {};
        response.status   = status;
        response.message  = msg;
        response.obj      = obj;
        return response;
    }
    
    static getRouterHelper(){
        return new RouterHelper();                
    }
}

Lib.RouterHelper = class{
    constructor() {
    }

    /**
     * If http/s post body doesn't have data we assume it's not complete
     * @returns data or false and response's json back on error
     */
    isValidPost(req) {
        let query = req.body;  
        if(!query || !query.data){
          console.log("invalid post: ", query); 
          //res.json(Lib.makeResponse(false, msg, false));
          return false;
        }
        return query.data;
    }

}

Lib.Jokes = class{
    
    constructor() {}

    getAllJokes(){	
		let query = {
			raw: true
		}
		return Jokes.findAll(query);
    }

    searchJokes(jokeX){	
		let query = {
			raw: true,
            where: {
                jokeName: {
                  [Op.like]: '%'+jokeX+'%'
                }
              }
		}
		return Jokes.findAll(query);
    }

    addJoke(jokeName, jokeType){
        let data = {
            jokeName: jokeName,
            jokeType: jokeType
        }
		return Jokes.create(data);
    }

    updateJoke(data, id){        
		let where = {where: {jokeID: id}};
        return Jokes.update(data, where);
    }

    removeJoke(id){      
		let where = {where: {jokeID: id}};
        return Jokes.destroy(where);
    }
}


module.exports.Lib = Lib 
