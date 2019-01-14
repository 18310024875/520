		var bd = document.body ;
var div = document.createElement('div')
	div.innerHTML = `<form>

		<input type="text" class="c1"/>
		<input type="text" class="c2"/>

	</form>`
	
	
	bd.appendChild( div );

		console.log( document.querySelectorAll('input[type=text]') );
		