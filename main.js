const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();

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

app.listen(PORT, () => {
	console.log("Server listening on port " + PORT);
});