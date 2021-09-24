const { RW } = require("./WorkflowModel");
const fetch = require("node-fetch")

class Workflow {
    constructor(formstate, workflow) {
        this.formstate = formstate;
        this.workflow = workflow;
        this.runningworkflow = undefined;
        this.currentmodule = undefined;
      //  console.log(workflow)
    }

    Run() {
        if(this.CheckTrigger()){
            this.currentmodule = this.workflow.modules.find(doc => doc.id === this.runningworkflow.id);
            console.log(this.currentmodule)
            while(this.currentmodule){
                this.Execute();
            }
            return this.formstate
        }else{
            console.log("canceled by trigger")
            return this.formstate;
        }

    }


    CheckTrigger(){
        switch (this.workflow.trigger.action) {
            case "==":
                if(this.formstate[this.workflow.trigger.fieldname] === this.workflow.trigger.fieldvalue){
                    this.CreateRunningWorkflow()
                    return true;
                }else{
                    return false;
                }
                break;
            case "!=":
                if(this.formstate[this.workflow.trigger.fieldname] !== this.workflow.trigger.fieldvalue){
                    this.CreateRunningWorkflow()
                    return true;
                }else{
                    return false;
                }
                break;
            default:
                break;
        }
        
    }

    CreateRunningWorkflow() {
        const newrunningworkflow = new RW({
            workflowname: this.workflow.name,
            recordName: this.formstate.Record,
            id: 0
        });
        this.runningworkflow = newrunningworkflow;
        //await newrunningworkflow.save();
    }

    Execute () {
        if(!this.currentmodule) return;
        switch (this.currentmodule.type) {
            case 'SetValues':
                for (let i = 0; i < this.currentmodule.fields.length; i++) {
                    this.formstate[this.currentmodule.fields[i].fieldname] = this.currentmodule.fields[i].entervalue;
                }
                this.currentmodule = undefined;
                break;

            case 'Script':
                this.runCustomScript(this.currentmodule.script);
                this.currentmodule = undefined;
                break;
                
            default:
                break;
        }
    }

    
    async runCustomScript (script) {
        try{
            eval(script);
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = Workflow;