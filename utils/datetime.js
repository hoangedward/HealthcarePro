const datetime = {  

  fromTimestamp: function fromTimestamp(timestamp) {
		
		if(timestamp*1 == 0) {
			return "-";
		}

		// Months array
		var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

		// Convert timestamp to milliseconds
		var date = new Date(timestamp*1);
		// return date.toDateString();

		// Year
		var year = date.getFullYear();

		// Month
		var month = months_arr[date.getMonth()];

		// Day
		var day = date.getDate();

		// Hours
		var hours = date.getHours();

		// Minutes
		var minutes = "0" + date.getMinutes();

		// Seconds
		var seconds = "0" + date.getSeconds();

		// Display date time in MM-dd-yyyy h:m:s format
		var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

		return convdataTime;
	}
}

export { datetime };  