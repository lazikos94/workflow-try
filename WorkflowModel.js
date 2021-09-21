const mongoose = require("mongoose");





// const workflowSchema = new mongoose.Schema({

//     name: { type: String, required: true },

//     trigger: {
//         type: { type: String, required: true, default: "Field", enum: ['Field'] },
//         triggerField: { type: String, required: false },
//         triggerValue: { type: String, required: false }
//     },

//     modules: [
//         {
//             type: "Approve",
//             order: { type: Number, required: true, default: 0 },
//             condition: {},
//             continue: { type: Boolean, required: true, default: false  }

//         },
//         {
//             type: "SetValues",
//             order: { type: Number, required: true, default: 0 },
//             condition: {},
//             continue: { type: Boolean, required: true, default: false  }
//         },
//         {
//             type: "SendEmail",
//             order: { type: Number, required: true, default: 0 },
//             condition: {},
//             continue: { type: Boolean, required: true, default: false  }
//         },

//     ]
    

// })

const workflowRunningSchema = new mongoose.Schema({

    workflowname: { type: String, required: true },
    recordName: { type: String, required: true },
    id: { type: Number, required: true, default: 0 },

});

const RW = mongoose.model("RunningWorkflow", workflowRunningSchema);



module.exports = { RW }