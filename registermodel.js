

function Registermodel (tablename, fields) {
    let newpreschema = new Object();

    for (let i = 0; i < fields.length; i++) {
        let f = fields[i]
       switch (f.type) {
           case 'string':
               newpreschema[f.name] = {
                   type: String,
                   required: f.required
               }
               if(f.enum){
                newpreschema[f.name].enum = f.enum
               }
               break;
            case 'number':
               newpreschema[f.name] = {
                   type: Number,
                   required: f.required
               }
               break;
           default:
               break;
       }
    }
    console.log(newpreschema)
       require("mongoose").model(tablename, new require("mongoose").Schema(newpreschema));
}

module.exports = Registermodel