/*
 * @Author: marineyulxl
 * @Date: 2023-03-30 15:36:24
 * @LastEditTime: 2023-04-18 21:19:44
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const loginRouter =require('./routes/login')
const productRouter =require('./routes/product')
const categoryRouter =require('./routes/category')
const orderRouter =require('./routes/order')
const swiperRouter =require('./routes/wx/swiper')
const cartRouter= require('./routes/wx/cart')
const addressRouter = require('./routes/wx/address')
const videoRouter = require('./routes/video')
const adminRouter = require('./routes/web/administrator')
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api',loginRouter)
app.use('/api',productRouter)
app.use('/api',categoryRouter)
app.use('/api',swiperRouter)
app.use('/api',cartRouter)
app.use('/api',addressRouter)
app.use('/api',orderRouter)
app.use('/api',videoRouter)
app.use('/api',adminRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
