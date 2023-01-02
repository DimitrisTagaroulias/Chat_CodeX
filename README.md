1.  In 'server' folder add an .env file with OPENAI_API_KEY= "your API key"
2.  In 'server' folder , on the server.js file, on line 47, set your 'PORT':
    e.g.
    app.listen('your PORT', () =>
    console.log("server is running on port http://localhost:'your PORT'")
    );
