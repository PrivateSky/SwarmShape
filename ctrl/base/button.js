/**
    default button controller
 */

registerShapeController("base/button",{
    model:null,
    init:function(){
        this.toView();
        var inp = $(this.view).find("input")[0];
        $(inp).live("click", this.click.bind(this));
        //
    },
    toView:function(){
        var inp = $(this.view).find("input")[0];
        inp.value = this.model;
        console.log("Binding button text: " + JSON.stringify(this.model));
    },
    click:function(objectId){
        this.getCtxtCtrl().dispatch("click",this.view);
        //alert(this.model + " got clicked!")
    }
});