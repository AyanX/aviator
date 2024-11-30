

const logOutController = (req, res) => {
    res.cookie("access", " ", { maxAge: 1 })
    
    return  res.status(200).send({message:"redirect"})
}
module.exports = logOutController