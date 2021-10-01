const { errorHandler } = require("../helpers/errHandler");
const { Order } = require("../models/order");

exports.orderById = (req,res,next,id) => {
    Order.findById(id)
    .populate('products.product','name price')
    .exec((error,order) => {
        if (error || !order) {
          return res.status(400).json({
            error: errorHandler(error),
          })
        }
        req.order = order;
        next();
    })
}

exports.create = (req, res) => {
    console.log(req.body)
    req.body.order.user = req.profile

    const order = new Order(req.body.order)
    order.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error),
        })
      }
    })
  }

exports.listOrders = (req,res) => {
    Order.find()
    .populate('user','_id name address')
    .sort('-created')
    .exec((error,orders) => {
        if (error) {
          return res.status(400).json({
            error: errorHandler(error),
          })
        }

        res.json(orders)
    })
}

exports.statusValues = (req,res) => {
    res.json(Order.schema.path('status').enumValues)
}

exports.updateStatus = (req,res) => {
    Order.updateOne(
      { _id: req.body.orderId },
      { $set: { status: req.body.status } },
      (error,order) => {
          if (error) {
            return res.status(400).json({
              error: errorHandler(error),
            })
          }
          res.json(order)
      }
    )
}