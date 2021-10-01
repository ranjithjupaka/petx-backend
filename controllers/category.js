const { errorHandler } = require('../helpers/errHandler');
const Category = require('../models/category')

exports.categoryById = (req, res, next, id) => {
  Product.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: 'category not found',
      })
    }

    req.product = product

    next()
  })
}

exports.read = (req, res) => {
  return res.json(req.product)
}

exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((err,data) => {
      if(err) 
      { 
          return res.status(400).json({
              error:errorHandler(err)
          })
      }

      res.send({data});
  })

}

exports.remove = (req, res) => {
  let category = req.category
  category.remove((err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }

    res.json({
      deletedCategory,
      message: 'category deleted sucessfully',
    })
  })
}

exports.update = (req, res) => {
  const category = req.category
  category.name = req.body.name
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }

    res.send({ data })
  })
}

exports.list = (req,res) => {
    Category.find().exec((err,data) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              })
            }

            res.send({ data })
    })
}