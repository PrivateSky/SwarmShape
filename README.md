shape
=====

Experimental web interface framework for creating complex RIA applications using Java Script 
Our simple rules: 
  - clean separation of models,views, controllers
  - have fat models, feature to describe self contained models (computed properties)  
  - html tags can become components if you put shape-ctrl or shape-view attributes 
  - have magic (like bindings, ChangeWatchers for chains, componentisation) but have as few APIs ad concepts as possible
  - use conventions to discover a proper controller

Main features:
- MVC (MVVM) with clean and simple architecture
- component oriented (yes, create reusable components with HTML!)
- client side Pub/Sub channels (safe and sound against asynchronous weirdness in computed values/expressions from  models or in callbacks for other messages/events)
- reusable layouts (experimental)
- works with Ajax and swarms (SwarmESB) for backend

Quick Example:
=======

   Model:
      
      shape.registerModel("task",{
              meta:{
                  table:"Task",
                  pk:"id"
              },
              id:{
                  type:"int"
              },
              description:{
                  type:"string",
                  value:"NoNamed"
              },
              completed:{
                  type:"boolean",
                  value:false
              }
          }
      );
      
   View (registered as task.render):
      
      <div class="view" shape-ctrl='todo/taskLine'>
           <input class="toggle" type="checkbox" shape-model = "@completed" >
           <label shape-model="@description" ></label>
           <button class="destroy" shape-model="@" shape-action="remove"></button>
       </div>

   Controller:
      
      //will take as model a task
      shape.registerCtrl("todo/taskLine",{
            count:0,
            init:function(){
                this.oldValue = this.model.completed;
                this.addChangeWatcher("completed", this.completedChanged);
            },
            toView:function(){
                $(this.view).toggleClass("completed", this.model.completed);
                this.oldValue = this.model.completed;
            },
            completedChanged:function(){
                if(this.oldValue != this.model.completed){
                    $(this.view).toggleClass("completed", this.model.completed);
                    this.action("completedToggle",this.model);
                    this.oldValue = this.model.completed;
                }
            }
        });

   And, finally, somewhere in your app: 
      
     <span id="myTask" shape-view="task.render" ></span>

      ...
      model = shape.newObject("task")
      shape.expandShapeComponent(document.getElementById("main"),null, model)
      
      