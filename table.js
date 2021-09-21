const table = {
    name: 'Product',
    fields: [
        {
            name: "Record", type: "string", enum: false, required: true
        },
        {
            name: "User", type: "string", required: true, enum: ['Mike', "Nancy", "Lazaros"]
        },
        {
            name: "Title", type: "string", enum: false, required: true
        },
        {
            name: "Price", type: "number", enum: false, required: true
        },
        {
            name: "State", type: 'string', enum: ['New', "Review", "Approval"], required: true
        }
    ]
}

module.exports = table