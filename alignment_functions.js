//author: William Dowling
//email: illustrator.dev.pro@gmail.com
//linkedin: https://www.linkedin.com/in/william-dowling-4537449a/
//Adobe Discussion Forum Post about this library: https://community.adobe.com/t5/illustrator/library-for-aligning-objects-via-script/m-p/11925954#M269613

//*******//

//Did you find this useful? Would you like to buy me a cup of coffee to say thanks?
//paypal.me/illustratordev
//<3

//*******//



//Alignment Functions
//
//given a key object and an an array of path items
//key : any pageItem
//otherObjects: Array of page items to align

//Known Issues:
// If you use these on items with clipping masks, the resulting
// alignment will be mathematically correct, but will likely be
// visually incorrect. This is because Illustrator includes clipped
// art in the dimensions of an object. =(




//align all elements of the array to the key object's center point
function alignObjectsToCenter(key,otherObjects)
{
	var kp = [key.left + key.width/2, key.top - key.height/2];

	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].left = kp[0] - otherObjects[x].width/2;
		otherObjects[x].top = kp[1] + otherObjects[x].height/2;
	}
}

//align all objects' vertical centers to the vertical center of key
function vAlignCenter(key,otherObjects)
{
	var kp = key.top - key.height/2;

	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].top = kp + otherObjects[x].height/2;
	}
}

//align all objects to the top of key
function vAlignTop(key,otherObjects)
{
	var kp = key.top;

	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].top = kp;
	}
}

//align all ojects to the bottom of key
function vAlignBottom(key,otherObjects)
{
	var kp = key.top - key.height;

	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].top = kp + otherObjects[x].height;
	}
}

//align all objects' center points to center point of key
function hAlignCenter(key,otherObjects)
{
	var kp = key.left + key.width/2;
	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].left = kp - otherObjects[x].width/2;
	}
}

//align all objects to the left edge of key
function hAlignLeft(key,otherObjects)
{
	var kp = key.left;
	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].left = kp;
	}
}

// align all objects to the right edge of key
function hAlignRight(key,otherObjects)
{
	var kp = key.left + key.width;
	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].left = kp - otherObjects[x].width;
	}
}

////////////////////////
////////ATTENTION://////
//
//		add some logic to allow for aligning to artboard
//
////////////////////////