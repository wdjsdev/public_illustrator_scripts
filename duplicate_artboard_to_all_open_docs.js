// what I'd really like it to do is to duplicate the source artboard 
// and its selection to ALL OTHER open documents. All except the source doc. 

//Script Description: Duplicate user selected artboard to all open documents
//Script high level functionality:
    //Script propmpts user to input artboard number to duplicate
    //the bounds of the artboard are logged
    //the artwork is duplicated into a "transport group".
        //if you copy the items individually, Illustrator creates an "undo state" for each item.
        //this can be annoying if you need to undo, becuase you could potentially run out of
        //available undo states and not be able to get back to the original state.
        //by grouping all the art that will be transferred, only one undo state is created,
        //and the art can easily be ungrouped and manipulated however you want after it's been duplicated
        //to the dest document.
    //for each open document (sans the source document)
        //activate document
        //create new artboard matching the artboardRect from the source document
        //duplicate the transfer group from the source document to the new artboard
            //and place it in a new layer named "imported artwork"
    //remove the transport group from the source document
    //end script



//author: William Dowling
//email: illustrator.dev.pro@gmail.com
//github: https://www.github.com/wdjsdev
//this project on github: https://github.com/wdjsdev/public_illustrator_scripts/blob/master/duplicate_artboard_to_all_open_docs.js
//linkedin: https://www.linkedin.com/in/william-dowling-4537449a/
//Adobe Discussion Forum Post that initiated this: https://community.adobe.com/t5/illustrator-discussions/javascript-to-duplicate-artboard-and-items-to-other-open-docs/td-p/13129047

//*******//

//Did you find this useful? Would you like to buy me a cup (or a pot) of coffee to say thanks?
//paypal.me/illustratordev
//<3

//Do you have some work to do, but you have more money than time/skill?
//Send me an email or a dm! I'll see what we can do to help each other..

//*******//
function duplicateArtboardToAllOpenDocuments()
{
    if(!app.documents.length)
    {
        alert("Please open at least 2 documents first, then try again.");
    }
    var doc = app.activeDocument;
    var ab = doc.artboards;
    var userChoice = prompt("Which artboard do you want to duplicate?", "1");

    if(!userChoice)
    {
        return;
    }
    if(userChoice < 1 || userChoice > ab.length)
    {
        alert("Invalid artboard number");
        return;
    }

    userChoice -= 1; //convert to zero-based index

    var abToDuplicate = ab[userChoice];
    var abDupRect = abToDuplicate.artboardRect;
    ab.setActiveArtboardIndex(userChoice);
    doc.selection = null;
    doc.selectObjectsOnActiveArtboard();
    
    //build a group of the selection to make it easier/faster/more efficient
    //to transfer the selection to all other open documents
    //you can ungroup this in the dest document here in the code if you want to
    var transportGroup = doc.groupItems.add();
    for (var s = doc.selection.length - 1; s >= 0; s--) {
        doc.selection[s].duplicate(transportGroup);
    }

    //loop all open documents and duplicate the transportGroup to each one, except the source document
    //destLay is a new layer in the dest document that will be used to place the transportGroup
    //to prevent runtime errors if the top layer is locked/hidden/inaccessible.
    //this layer can be removed from here in the code and you can simply move() the transportGroup
    //to wherever you want it to be in the dest document.
    
    var docsArray = [];

    //build an array of all open documents except the source document, which is app.documents[0]
    for (var d = app.documents.length - 1; d >= 1; d--) {
        docsArray.push(app.documents[d]);
    }

    //process each document in the array
    for(var d=0;d<docsArray.length;d++)
    {
       processDoc(docsArray[d]);
    }

    //remove the transport group from the source document
    transportGroup.remove();


    //reset the app.coordinate system to whatever it was before the script ran
    // app.coordinateSystem = prevCoordSystem;




    function processDoc(destDoc)
    {
        destDoc = docsArray[d];
        destDoc.activate();
        vardestAb = destDoc.artboards.add(abDupRect);
        //move artboard by assigning it a new artboardRect
        //keep track of the distance the artboard moves, then
        //apply the same transformation to the artGroup
        
        
        var destLay = destDoc.layers.add();
        destLay.name = "imported artwork";
        var destArt = transportGroup.duplicate(destDoc);
        destArt.moveToBeginning(destLay);
    }
}
duplicateArtboardToAllOpenDocuments();