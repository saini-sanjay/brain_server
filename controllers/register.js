const handleRegister=(req,res,db,bcrypt)=>{
	const {email, password,name}=req.body; 
	if(!name||!email||!password){
		return res.status(400).json('incorrect form submission')
	}
	//console.log(name);
	const hash=bcrypt.hashSync(password);
	db.transaction(trx=>{
       trx.insert({
			hash:hash,
			email:req.body.email
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
			return trx('users')
			.returning('*')
			.insert({
				 name:name,
	 email:loginEmail[0],
	 joined:new Date()
	}).then(user =>{
		res.json(user[0]);
			})
	.then(trx.commit)
	.catch(trx.rollback)

		})
		.catch(err=>{res.status(400).json(err);console.log(err);})
	})}

	module.exports={
		handleRegister:handleRegister
	}
