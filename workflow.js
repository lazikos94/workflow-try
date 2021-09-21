const { RW } = require("./WorkflowModel");

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
          //  console.log(this.currentmodule)
            while(this.currentmodule){
                this.Execute();
            }
            return this.formstate
        }else{
            return this.formstate;
        }

    }


    CheckTrigger(){
        if(this.formstate[this.workflow.trigger.fieldname] === this.workflow.trigger.fieldvalue){
            this.CreateRunningWorkflow()
            return true;
        }else{
            return false;
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
        
            default:
                break;
        }
    }
}

module.exports = Workflow;