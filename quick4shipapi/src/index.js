let express =  require('express')
let app = express()

const UserEndpoint = require('./routes/user')


app.use((req,res,next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl}`)
    next()
})


let path = require('path')

let bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))

//cros resources allow origin
app.use((req,res,next) => {
    res.header("Access-Control-Allow-origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})




app.get('/', (req,res) =>{
    res.send('Hello from server')
})

app.use('/user', UserEndpoint)


//Handler for 404 - Resources not found
app.use((req,res,next) =>{
    res.status(404).send('We think you are lost')
})

//Handler for Error 5000
app.use((err,req,res,next) => {
    console.error(err.stack)

    res.sendFile(path.join(__dirname, '../public/500.html'))
})










const port = process.env.port || 3000
app.listen(port, () => console.info(`Serrever has started on ${port}`))