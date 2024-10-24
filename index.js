import express from 'express'
import mongoose from 'mongoose'

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

const app = express()
app.use(express.json())

await mongoose.connect(MONGO_URI)
const db = mongoose.connection.db
const collection = db.collection('users')

app.get('/', (req, res) => {
	res.send(`Connected to db: ${db.databaseName}`)
})

app.get('/users', async (req, res) => {
	const { name, email } = req.query

	let query = {}
	if (name) query.name = name
	if (email) query.email = email

	const users = await collection.find(query).limit(10).toArray()
	res.json(users)
})

app.get('/delete', async (req, res) => {
	const { name } = req.query

	if (name == null) {
		res.send('Invalid')
		return
	}

	const result = await collection.deleteOne({ name: name })

	if (result.deletedCount > 0) {
		res.send('User deleted successfully')
	} else {
		res.send('User not found')
	}
})

app.get('/add', async (req, res) => {
	const { name, email, age } = req.query

	const newUser = await collection.insertOne({ name, email, age })
	res.json(newUser)
})

// app.get('/update', async (req, res) => {
// 	const { id, name, email, age } = req.query

// 	await collection.findByIdAndUpdate(
// 		id,
// 		{ name, email, age },
// 		(updatedUser) => {
// 			console.log(updatedUser)
// 		}
// 	)
// })

app.listen(PORT, () => {
	console.log(`Running on http://localhost:${PORT}`)
})
