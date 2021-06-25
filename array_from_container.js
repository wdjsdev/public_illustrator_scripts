//author: William Dowling
//email: illustrator.dev.pro@gmail.com
//linkedin: https://www.linkedin.com/in/william-dowling-4537449a/
//Adobe Discussion Forum Post about this library: https://community.adobe.com/t5/illustrator/library-for-aligning-objects-via-script/m-p/11925954#M269613

//*******//

//Did you find this useful? Would you like to buy me a cup of coffee to say thanks?
//paypal.me/illustratordev
//<3

//*******//


//returns a clean javascript array of child items matching the given criteria
//container is some container object
	//eg. layer,groupItem,document
//crit is a string representing the type of child items
//you want to get. If no criteria is given, default value is "pageItems".
	//eg. "textFrames","groupItems","placedItems","layers", etc

function arrayFromContainer(container,crit)
{
	if(!container)return [];

	var result = [];
	var items;
	if(!crit || crit === "any")
	{
		items = container.pageItems;
	}
	else
	{
		items = container[crit];
	}
	for(var x=0;x<items.length;x++)
	{
		result.push(items[x])
	}
	return result;
}