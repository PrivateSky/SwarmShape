shape.registerTypeBuilder("int",{
    initializer:function(objectDescription, args){
            if(objectDescription.value!=undefined){
                if(objectDescription.value==null || objectDescription.value=="null"){
                    return null;
                }
                return objectDescription.value;
            }else{
                return 0;
            }
        }
    }
);