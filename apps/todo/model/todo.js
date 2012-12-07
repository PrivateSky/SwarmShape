
shape.registerModel("todo",{
        meta:{
            persitence:"none"
        },
        ctor:function(){
          this.current = this.all;
          this.autoSelection = false;
        },
        all:{
            type:"collection",
            contains:"task"
        },
        active:{
            type:"collection",
            contains:"task"
        },
        completed:{
            type:"collection",
            contains:"task"
        },
        current:{
            type:"collection",
            value:"null"
        },
        newTitle:{
            type:"string"
        },
        recentTask:{
            type:"task",
            value:"null"
        },
        pluralizer:{
            chains:"todoCount",
            code:function(){
                if(this.todoCount == 1){
                    return "";
                } else {
                    return "(s)";
                }
            }
        },
        todoCount:{
            chains:"active.length",
            code:function(){
                return this.active.length;
            }
        },
        completedCount:{
            chains:"completed.length",
            code:function(){
                return this.completed.length;
            }
        },
        selectAll:{
            type:"Boolean",
            value:"false"
        },
        selectAllChecked:{
            chains:"selectAll",
            code:function(){
                if(this.autoSelection!=this.selectAll){
                    for(var i = 0; i < this.current.length; i++){
                        this.current.getAt(i).completed = this.selectAll;
                    }
                }
            }
        },
        checkSelection:{
           chains:"completed",
           code:function(){
               var check = true;
               for(var i = 0; i < this.current.length; i++){
                   if(!this.current.getAt(i).completed){
                       check = false;
                       break;
                   }
               }
               this.selectAll = this.current.length > 0 ? check : false;
               this.autoSelection = this.selectAll;
           }
        },
        toggle:function(model){
            if(model.completed == true){
                this.active.remove(model);
                this.completed.push(model);
            } else{
                this.completed.remove(model);
                this.active.push(model);
            }
        },
        remove:function(model){
            this.all.remove(model);
            if(model.completed){
                this.completed.remove(model);
            } else {
                this.active.remove(model);
            }
        },
        removeAllCompleted:function(model){
            this.completed.removeAll();
            this.all.copy(this.active);
        },
        addNewTask:function(description){
            var newTask = shape.newPersistentObject("task");
            newTask.description = description;
            this.active.push(newTask);
            this.all.push(newTask);
            return newTask;
        },
        query:{
            lang:"sql",
            params:"personId",
            typeName:"Person",
            value:"select * from Tasks p where p.id={personId}"
        }
    }
);



