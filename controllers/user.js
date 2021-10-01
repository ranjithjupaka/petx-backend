const User = require('../models/user');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/errHandler');

exports.userById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'user not found',
            });
        }

        req.profile = user;

        next();
    })
}

exports.addOrderToUserHistory = (req,res,next) => {
   let history = [];
   
   req.body.order.products.forEach((item) => {
       history.push({
           _id:item._id,
           name:item.name,
           description:item.description,
           category:item.category,
           quantity:item.count,
           transaction_id:req.body.order.transaction_id,
           amount:req.body.order.amount
       })
   })

   User.findOneAndUpdate(
       {_id:req.profile._id},
       {$push:{history:history}},
       {new:true},
       (error,data) => {
           if(error){
               return res.status(400).json({
                   error:'sorry updating user history for this order not sucessful'
               })
           }
           next()
       }
   )
}


exports.purchaseHistory = (req,res) => {
   Order.find({user:req.profile._id})
   .populate('user','_id name')
   .sort('-created')
   .exec((err,orders) => {
       if(err){
           return res.status(400).json({
               error:errorHandler(err)
           })
       }
       res.json(orders)
   })
}