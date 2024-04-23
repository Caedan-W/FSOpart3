const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const phoneNumberPattern = /^\d{2,3}-\d{4,}$/

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        //minLength: 8,
        required: true,
        validate: {
            validator: function(v) {
                return phoneNumberPattern.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
})

// 使用 pre('findByIdAndUpdate') 中间件进行更新操作时的验证
personSchema.pre('findByIdAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.number && !phoneNumberPattern.test(update.$set.number)) {
        const err = new Error(`Invalid phone number format: ${update.$set.number}`);
        next(err);
    } else {
        next();
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)