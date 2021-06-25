function arrayFromContainer(container,crit)
{
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