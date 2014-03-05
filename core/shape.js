/*
  Framework's main class:
   Features:
     1. register dependencies: controllers, models, views (shape urls) and custom attributes plugins
     2. create objects (transient, global): newObject, newTransient
     3. shaping DOM functions:

 3.0 expandShapeComponent = function(domObj, parentCtrl, rootModel): expand a tag with shape-view attribute
 3.1 expandExistingDOM = function(domElem,parentCtrl,rootModel): do bindings and shape expansions on existing DOM elements


 */
function Shape(){
    var shape = this;

    var shapeLocaleRegistry = {};

    ShapeUtil.prototype.initUtil();
    ShapeUtil.prototype.initRepositories();
    ShapeUtil.prototype.initSchemaSupport();
    ShapeUtil.prototype.initDOMHandling();
    ShapeUtil.prototype.initPersistences();


    function mergeInRepository(repo, key, newValues){
        if(repo[key]==undefined){
            repo[key] = {};
        }

        for(var newKey in newValues){
            if(repo[key][newKey]!=undefined){
                wprint("Overwriting key "+ newKey);
            }
            //in some cases a full cloning could be more appropriate
            repo[key][newKey] = newValues[newKey];
        }
    }


    this.registerLocale = function(language, dictionary){
        mergeInRepository(shapeLocaleRegistry, language, dictionary);
    }

    this.getLocaleKey = function(key, language){
        if(language==undefined){
            language = this.currentLanguage;
        }
        var lang = shapeLocaleRegistry[language];
        if(lang){
            return lang[key];
        }
        return undefined;
    }

    this.currentLanguage ="en";
    this.languageDebug   = false;

    /*
        Main public functions of shape are (not declared here but added by init functions):
     newEntity(className,args)    : create a persistent object
     newTransient(className,args) : create a transient object
     lookup(className, pk)        : lookup in persistence after an existing object (with PK)
     */

    this.alert = function(message, okHandler, cancelHandler){
        //look in body, add child,etc...
        var message = message;
        var stopBlink = false;

        if(!message){
            message = "Something went wrong!";
        }
        var overLay=document.createElement('div');
        overLay.setAttribute("id","overlayModal");
        document.getElementsByTagName("body")[0].appendChild(overLay);
        var dialogBox=document.createElement('div');
        dialogBox.setAttribute("class","modalDialog");
        dialogBox.setAttribute("id","dialogBox");
        //document.getElementsByTagName("body")[0].appendChild(dialogBox);
        dialogBox.innerHTML = '<div class="contentModal">' +
                                '<label class="labelModal">'+message+'</label>' +
                                '<div class="actionModal">' +
                                    '<button id="okButton" class="modalButton">Ok</button>' +
                                    '<button id="cancelButton" class="modalButton">Cancel</button>' +
                                '</div>' +
                              '</div>'
                              //'<embed src="deps/sound/alertSound.mp3" autostart="true" hidden="true" loop="false">';
        document.getElementsByTagName("body")[0].appendChild(dialogBox);
        document.getElementById("okButton").onclick=function(){
            document.getElementById("overlayModal").remove();
            document.getElementById("dialogBox").remove();
            stopBlink = true;
            console.log("okHandler ",okHandler);
            if(okHandler){
               okHandler();
            }

        };
        if(cancelHandler){
            document.getElementById("cancelButton").onclick=function(){
                document.getElementById("overlayModal").remove();
                document.getElementById("dialogBox").remove();
                stopBlink = true;;
                cancelHandler();
            };
        }else{
            document.getElementById("cancelButton").remove();
        }

        var snd = new Audio("deps/sound/alertSound.wav"); // buffers automatically when created
        snd.play();

        function blink(){
              if(stopBlink){
                  document.title = shape.appTitle;
                  return;
              }

             if(document.title == L("Alert")){
                 document.title = L(shape.appTitle);
             } else{
                 document.title = L("Alert");
             }

            setTimeout(function(){
                blink();
            },1000);
        }

        blink();
    }
}

window.shape = new Shape();
shape = window.shape;

function getBaseUrl(){
    if(shape.baseUrl  == undefined){
        var l = window.location;
        shape.baseUrl = l.protocol + "//" + l.host + "/" + l.pathname.split('/')[1];
    }
    return shape.baseUrl;
}


//cprint("Loading shape...");

function UrlHashChange(obj){
    this.type=SHAPEEVENTS.URL_CHANGE;
    for(var prop in obj){
        if(prop!= "type"){
            this[prop]=obj[prop];
        }else{
            wprint("Sorry dude, \"type\" is a keyword for hash fragments in Shape's URLs!");
        }
    }
}

function watchHashEvent(ctrl){
    function handler(e){
        var fragment = window.location.hash;
        var index = fragment.indexOf("#");
        if(index == -1) {
            fragment = "";
        } else{
            fragment = fragment.substr(index+1);
        }
        ctrl.emit(new UrlHashChange(fragmentToObject(fragment)));
    }
    $(window).bind('hashchange', handler);
    handler(null);
}

function navigateUsingObject(obj){
    window.location.hash = objectToFragment(obj);
}

L = function(key){
    try{
        var text = shape.getLocaleKey( key);
    }catch(err){
        //hoho
    }
    if(text==undefined){
        if(shape.languageDebug){
            console.log("No localisation for:", key);
        }
        text = key;
    }
    return text;
}