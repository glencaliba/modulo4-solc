const assert = require( 'assert');
const ganache = require( 'ganache-cli');
const Web3 = require ('web3');
const web3 = new Web3( ganache.provider());
const {interface, bytecode } = require('../compile');

let accounts; 
let inbox;



beforeEach( async()=> {
   //Get a list  of all accounts 
   accounts = await web3.eth.getAccounts();
    
   //Use one of those account to deploy
   // the contract
    console.log( accounts[0]);
    inbox = await new web3.eth.Contract(JSON.parse( interface))
    .deploy(
        {data:bytecode,arguments:['Hi there']})
    .send({ gas: '21000' , from: accounts[0] });
});


describe( 'Inbox', () =>{
    
    it( 'deploy a contract', () => {
        assert.ok( inbox.options.address );
    });
    it('has a default message', async () =>{
        const message = await inbox.method.message().call();
        assert.equal ( message, 'Hi there');
    })
    
    it( 'can chnage message', async ()=>{
        await inbox.method.setMessage('bye').send( accounts[0]);
        const message = await inbox.method.message().call();
        assert.equal ( message, 'bye');
    })
})