//
//given a key object and an an array of path items
//key : any pageItem
//otherObjects: [Array of page items]




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

function vAlignCenter(key,otherObjects)
{
	var kp = key.top - key.height/2;

	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].top = kp + otherObjects[x].height/2;
	}
}

function vAlignTop(key,otherObjects)
{
	var kp = key.top - key.height/2;

	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].top = kp + otherObjects[x].height/2;
	}
}

function vAlignBottom(key,otherObjects)
{
	var kp = key.top - key.height;

	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].top = kp + otherObjects[x].height;
	}
}

function hAlignCenter(key,otherObjects)
{
	var kp = key.left + key.width/2;
	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].left = kp + otherObjects[x].width/2;
	}
}

function hAlignLeft(key,otherObjects)
{
	var kp = key.left;
	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].left = kp;
	}
}

function hAlignRight(key,otherObjects)
{
	var kp = key.left + key.width;
	for(var x=0;x<otherObjects.length;x++)
	{
		otherObjects[x].left = kp - otherObjects[x].width;
	}
}