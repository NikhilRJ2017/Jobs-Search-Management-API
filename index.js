require('dotenv').config();
require('express-async-errors');

//************* importing security packages **************/
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


const express = require('express');
const app = express();

const connectDB = require('./config/db/connect');

const authenticationMiddleware = require('./config/middlewares/auth');

const pageNotFound = require('./config/middlewares/page_not_found');
const errorHandler = require('./config/middlewares/error_handler');

const authRouters = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

//************* security middlwares *************/

//?If you are behind a proxy/load balancer (usually the case with most hosting services, e.g. Heroku, Bluemix, AWS ELB etc),
//?the IP address of the request might be the IP of the load balancer/reverse proxy (making the rate limiter effectively a 
//?global one and blocking all requests once the limit is reached) or undefined.  To solve this issue, 
//?add app.set('trust proxy', numberOfProxies)

app.set('trust proxy', 1)
const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 50 //limit each ip to 50 request per windowMs
});
app.use(apiLimiter);
app.use(helmet());
app.use(cors());
app.use(xss());

//************* body parsing middlewares *************/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//************* main routes *************/
app.use('/api/v1/auth', authRouters);
app.use('/api/v1/jobs', authenticationMiddleware, jobsRouter);


//************* Error handling middlewares ************/
app.use(pageNotFound);
app.use(errorHandler);

//************* Spin up the server **************/
const PORT = process.env.PORT || 6000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_DB_URI);
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}...`);
        })
    } catch (error) {

    }
}

start();