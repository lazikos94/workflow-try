const mg = require("mongoose")
const registermodel = require("./registermodel");
const Workflow = require("./workflow");
const mongoose = require("mongoose");

async function Run () {
    try{
        const db = await mg.connect("mongodb+srv://admin:NsHwmRpeUNM4mXYx@eclass-clone.1unzv.mongodb.net/workflow?retryWrites=true&w=majority");

        registermodel(require("./table").name, require("./table").fields)

        const http = require("http")
        const express = require("express")
        const app = express();
        const server = http.createServer(app);
        app.use(require("cors")())
        app.use(express.json())

        app.get('/3', (req, res) => res.sendFile(require("path").resolve() + "/index.html"))
        app.get('/', (req, res) => res.status(200).json({message: "dfsafds"}))


        app.get("/p/:id", async (req, res) => {
            console.log("here feetchin")
            const current = await mongoose.model("Product").findById(req.params.id);
            res.status(200).json(current)
        });

        const workflow1 = {
            name: 'Change Tile',
            trigger: {
                type: "field",
                fieldname: "User",
                fieldvalue: "Mike",
                action: "!=" // "!="
            },
            modules: [
                {
                    type: 'Script',
                    name: "Custom Script",
                    script: `setTimeout(async () => {
                        const res = await fetch("http://192.168.1.13:4500/api/kati");
                        const resdata = await res.text();
                        const fs = require("fs");

                        fs.writeFile(require("path").resolve() + "/index.xml", resdata, (err) => {
                            if(err){
                                console.log(err);
                            }
                        })
                       
                        console.log(resdata + "<- apo allo server api");
                    }, 3000)`,
                    id: 0,
                    continue: false,
                }
            ]
        }

        app.post("/p/record", async (req, res) => {
            const formstate= req.body;

            const workflow = new Workflow(formstate, workflow1);
            workflow.Run()


        })

        // {
        //     type: 'SetValues',
        //     name: "Set Values",
        //     fields: [
        //         {
        //             fieldname: "Title",
        //             entervalue: "Updated by workflow"
        //         }
        //     ],
        //     id: 0,
        //     continue: false,
        // },



        const workflow = {
            name: 'Change Tile',
            trigger: {
                type: "field",
                fieldname: "State",
                fieldvalue: "Review"
            },
            modules: [
                {
                    type: 'SetValues',
                    name: "Set Values",
                    fields: [
                        {
                            fieldname: "Title",
                            entervalue: "Updated by workflow"
                        }
                    ],
                    id: 0,
                    continue: false,
                }
            ]
        }
        const {RW} = require("./WorkflowModel")

        app.post("/new", async (req, res) => {
            try{
                console.log(req.body, "body")

                let formstate = req.body;

                let currentWorkflow = workflow;

                const wk = new Workflow(formstate, currentWorkflow);
                formstate = wk.Run();
                console.log(formstate)

                // if(currentWorkflow.trigger.type === 'field'){
                //     if(formstate[currentWorkflow.trigger.fieldname] === currentWorkflow.trigger.fieldvalue){
                //         const newrunningworkflow = new RW({
                //             workflow: currentWorkflow.name,
                //             recordName: formstate.Record,
                //             order: 0
                //         });
                //         //await newrunningworkflow.save();

                //         const current = currentWorkflow.modules.find(doc => doc.order === newrunningworkflow.order);
                //         if(!current) return;
                //         switch (current.type) {
                //             case 'SetValues':
                //                 for (let i = 0; i < current.fields.length; i++) {
                //                     formstate[current.fields[i].fieldname] = current.fields[i].entervalue;
                                    
                //                 }
                //                 break;
                        
                //             default:
                //                 break;
                //         }
                //     }
                // }

                console.log(formstate)
                return;
                const Table = mg.model("Product");
                const newrecord = new Table(req.body);
                await newrecord.save();




                res.status(200).json(0)
            }catch(err){
                console.log(err)
                res.status(400).json(-1)
            }
        })
        server.listen(5000)
        

        // const table = mg.model("Table", new mg.Schema({
        //     title: String,
        //     state: String
        // }));
        // const newtable = new table({
        //     title: 'hi',
        //     state: "hello"
        // })
        // await newtable.save()
        //console.log(newtable)
    }catch(err){
        console.log(err.name, err.message)
    }

}

Run()