const express = require('express');
const app = express();

// needed to use .env
require('dotenv').config()

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production')
{
	// Set static folder
	app.use(express.static('frontend/build'));
	app.get('*', (req, res) =>
	{
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
	});
}

app.set('port', (process.env.PORT || 5000));
app.use((req, res, next) =>
{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
	'Access-Control-Allow-Headers',
	'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, DELETE, OPTIONS'
	);
	next();
});

// middleware
app.use(express.json());

// api endpoints
const usersRouter = require("./api/users");

// activate routers
app.use("/api/users", usersRouter);

// yippee!
app.listen(PORT, () => {
	console.log("Server listening on port " + PORT);
});
