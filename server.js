 const express=require('express');
 const bodyParser=require('body-parser');
 const bcrypt=require('bcrypt-nodejs');
 const cors=require('cors');
 const register=require('./controllers/register');
 const signin=require('./controllers/signin');
const app=express();
app.use(bodyParser.json());
app.use(cors());
 const knex=require('knex');
 const db=knex({
  client: 'pg',
  connection: {
    host : ' postgresql-triangular-95933',
    user : 'postgres',
    password : '',
    database : 'smart_brain',
    port:'3000'
  }
});

app.get('/', (req,res)=>{
	return db.select('*').from('users')
	.then(data=>
	res.json(data))
})
app.post('/signin', (req,res)=>{signin.handleSignin(req,res,db,bcrypt)

})
app.post('/register', (req,res)=>{register.handleRegister(req,res,db,bcrypt)})
app.get('/profile/:id',(req,res)=>{
	const {id}=req.params;
	console.log(id);
	//let found =false;
	db.select('*').from('users').where({id})
	.then(user=>{
		if(user.length)
		res.json(user[0]);
else{
	res.status(404).json('not found');
}
	})
	.catch(err=>	res.status(404).json('error getting user'));
	
})
app.put('/image',(req,res)=>{
		const {id}=req.body;
	db('users').where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries=>{
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'))
		
			})
			
			
 app.listen(process.env.PORT||3002);
 	console.log(`Great,App is running on port ${process.env.PORT} `);