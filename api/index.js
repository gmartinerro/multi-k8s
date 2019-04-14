const keys = require ('./keys');
const redis = require('redis');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Express setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Redis setup
const redisClient = redis.createClient({
    host:keys.redisHost,
    port:keys.redisPort,
    retry_strategy: ()=>1000
});

const redisPublisher = redisClient.duplicate();

// PG setup
const {Pool} = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    port: keys.pgPort,
    database: keys.pgDatabase,
    password: keys.pgPassword
})

pgClient.on('error',()=>{console.log("Lost PG connection")});

pgClient.query('CREATE TABLE IF NOT EXISTS values(number INT)')
        .catch((err)=>console.log(err));


app.get('/',(req,res)=>{
    res.send("Hi")
});

app.get('/values/all',async (req,res)=>{
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
});

app.get('/values/current',async (req,res)=>{
    console.log("QUERYING CURRENT");
    const values = redisClient.hgetall('values',(err,values)=>{
        console.log(values);
        res.send(values);
    });    
});

app.post('/values',async (req,res)=>{
    const index = req.body.index;
    if(parseInt(index)>40){
        return res.status(422).send('Index too high');
    }

    console.log(redisClient.hset('values',index,'Nothing yet!'));
    redisPublisher.publish('pubsub',''+index);
    pgClient.query('INSERT INTO values (number) VALUES($1)',[index]);

    res.send({working:true});
})

app.listen(5000,()=>{
    console.log("Listening on port " + 5000 )
})
