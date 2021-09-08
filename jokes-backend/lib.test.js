//for jest required to recognize the missing encoding and include dotenv
require('dotenv').config();
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');

const Lib = require('./lib').Lib;

//test function makeReponse 
test('Check default API response function', () => {
    let list = Lib.makeResponse(false, "message here", false)
    expect(list).toMatchObject({status: false, message: "message here", obj: false});
});

//test function isValidPost
test('Check default API response function', () => {
    const RH 	      = new Lib.RouterHelper();
    const fakeRequest = {body: {data: {name: "sailab"}}};
    expect(RH.isValidPost(fakeRequest)).toMatchObject({name: "sailab"});
});

//test .ENV file var x
test('Check .ENV file line x', () => {
    let varX = process.env.PORT;
    console.log("env result: ", varX);
    expect(varX).toHaveLength(4);
});

//get all jokes
test('Test get all jokes function', async () => {
    const Jokes 	      = new Lib.Jokes();
    //const fakeRequest = {body: {data: {name: "sailab"}}};
    let list = await Jokes.getAllJokes();
    console.log("Total jokes found: ", list.length);
    expect(Array.isArray(list)).toBe(true);
});
