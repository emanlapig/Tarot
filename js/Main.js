// BGem Tarot Main JS

var cardNodes = [],
	shuffle = {
		index: 0,
		collect: 0,
		flip: 0
	};

function init() {
	load_cards();
	$( "div" ).on( "touchstart", function(e) { e.preventDefault(); } );
	$( "#done-btn" ).on( "click touchstart", collectShuffle );
	shuffle.index = 0;
	setTimeout( function() {
		shuffle.flip = setInterval( function() {
			$( "#card-" + shuffle.index ).addClass( "flip" );
			shuffle.index += 1;
			if ( shuffle.index === cardNodes.length ) {
				clearInterval( shuffle.flip );
				shuffle.index = 0;
			}
		}, 50 );
	}, 2000 );
};

function load_cards() {
	for ( var i=0; i<cardData.cards.length; i++ ) {
		var card = document.createElement( "div" );
		card.setAttribute( "class", "card" );
		card.setAttribute( "id", "card-" + i );
		card.innerHTML = "<img src='img/decks/UWaite/" + i + ".jpg' />";
		$( ".cards-container" ).append( card );
		var cardWidth = .05 * window.innerWidth,
			boxWidth = Math.floor( cardWidth * 13 ),
			sideMargin = Math.floor( ( window.innerWidth - boxWidth ) / 2 ),
			x = Math.floor( i%13 * ( cardWidth ) + sideMargin ),
			y = Math.floor( Math.floor( i/13 ) * window.innerHeight/7 );
		cardNodes.push([ 
			x,
			x + cardWidth,
			y,
			y + cardWidth*1.5,
			i
		]);
		$( card ).css( { "left": x + "px", "top": y + "px" } );
		$( ".touch-area" ).on( "touchmove mousemove", function( e ) {
			var touchX = ( e.originalEvent.touches !== undefined )? e.originalEvent.touches[0].pageX : e.pageX,
				touchY = ( e.originalEvent.touches !== undefined )? e.originalEvent.touches[0].pageY : e.pageY
			for ( var i=0; i<cardNodes.length; i++ ) {
				if ( 
					touchX > cardNodes[i][0]-cardWidth &&
					touchX < cardNodes[i][1]+cardWidth &&
					touchY > cardNodes[i][2]-cardWidth*1.5 &&
					touchY < cardNodes[i][3]+cardWidth*1.5
				) {
					var x = Math.floor( random( 0, window.innerWidth - cardWidth ) ),
						y = Math.floor( random( 0, window.innerHeight - cardWidth*1.5 ) );
					cardNodes[i] = [
						x,
						x + cardWidth,
						y,
						y + cardWidth*1.5,
						i
					];
					$( "#card-" + i ).css( { "left": x + "px", "top": y + "px" } );
				}
			}
		});
	}
};

function collectShuffle() {
	$( ".touch-area" ).unbind();
	cardNodes.sort( function( a, b ) {
		return a[0] - b[0];
	});
	shuffle.index = 0;
	shuffle.collect = setInterval( function(){
		$( "#card-" + cardNodes[ shuffle.index ][4] ).css( { "top": window.innerHeight - 200 + "px", "left": shuffle.index*10 + 100 + "px", "z-index": shuffle.index } );
		shuffle.index += 1;
		if ( shuffle.index === cardNodes.length ) {
			$( ".touch-area" ).css( "display", "none" )
			clearInterval( shuffle.collect );
		}
	}, 50 );
};

var cardLoader = {

};

var shuffler = {
	
};

var reader = {

};

function random( min, max ) {
	return Math.floor( ( Math.random() * max ) + min );
};

var cardData = {
	"cards": [
		{
			"name": "The Fool",
			"suit": "Major Arcana",
			"no": "0",
			"img": "00.jpg",
			"tags": [],
			"description": "",
			"details": "<p>The Fool is the most important card in the entire Tarot Deck. The Fool is the light in the darkness, questing for knowledge. The Fool both asks the questions, and gives the answers to all the mysteries of the Tarot. He is the innocent and the trickster in the same moment, the young Merlin of the Arthurian legends, and the Coyote or the Raven in the Native American mythos. In medieval times, the Fool made his appearance as the Court Jester or Royal Dwarf amongst the nobility of Europe: remember, the Tarot was originally developed for the Royal Courts.</p><p>Represented as a well dressed young man, The Fool strides towards the edge of the precipice, solid rock beneath his feet. He is poorly shod for the journey ahead. His youthful face turns towards the sky, and upon his shoulder he carries a staff bearing a bag, light enough to carry without unbalancing him. In this bag, he will pour all the treasures of knowledge that he acquires during his journey through life, as described by the Tarot Cards. The red feather in his hat gives him a jaunty air, and the white rose he carries in his left palm shows a child-like delight in the natural world. Both the red feather and the white rose conceal secrets yet to be discovered. These are the colors of the magical garments worn by The Magician, the next card after the Fool. White represents passion and the desire to achieve what seems impossible. A little white dog, The Fool's dog, barks at his heels as if to warn of danger; the dog is a reminder of the Fool's animal nature. In some decks, the dog is replaced by the wolf. Our animal insticts are often subjugated by today's way of life, but it is those basic insticts that keep us alive. Our animal natures include self preservation, fight or flight. As our joyful Fool understands, his journey will only be complete if he listens to his instincts.</p>"
		},
		{
			"name": "The Magician",
			"suit": "Major Arcana",
			"no": "I",
			"img": "01.jpg",
			"tags": [],
			"description": "",
			"details": "<p>The Magician or Magus is the card of the beginning; the birth of understanding our role in balancing universal energies. The Magician is awakening to how knowledge is acquired. He is acquiring knowledge for his own personal development, but even more significantly, for the benefit of the universe as a whole. The Magician is represented as a young man standing before a table: the Altar of Harmony. Upon the altar are the symbols of the Neoplatonic elements of life: the Wand of Intellect, the Sword of Positive Action, the Pentacle of Stability, and the Chalice of Pure Emotion. They represent, in order: the Wand for Fire, the Sword for Air, the Pentacle for Earth, and the Chalice for Water. As Shakespeare says in his play Julius Cesar: 'His life was gentle; and the elements so mixed in him, that Nature might stand up and say to all the world, THIS WAS A MAN!' Above the Magician's head is the symbol of infinity, the movement of creation itself, indestructible cosmic forces of pure energy. This symbol is reflected in his belt - the serpent swallowing its tail, as the snake sheds its skin; the ancient symbol of immortality reborn over and over again. The serpent has always been associated with all things immortal. The Magician's white inner robe of purity and abstract thought are reflected by the lilies that surround him. They are the moon flowers, the light in the darkness, the Bright Shadow of Jungian psychology, found in our subconscious minds. The red outer robes are the Magician's desires, passions, and determination to achieve his goal, reflected again by the red roses surrounding him. His right hand points a Magic Wand towards the heavens, while his left one points to the Earth. He is bringing down manifestation to the world: 'As above, so below.' The Magician materializes his dreams by being in harmony with the Divine will. He encourages all creation with this simple gesture, the unity of spirit and matter, eternity in action.</p>"

		},
		{
			"name": "The ",
			"suit": "Major Arcana",
			"no": "II",
			"img": "02.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Empress",
			"suit": "Major Arcana",
			"no": "III",
			"img": "03.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Emperor",
			"suit": "Major Arcana",
			"no": "IV",
			"img": "04.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Hierophant",
			"suit": "Major Arcana",
			"no": "V",
			"img": "05.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Lovers",
			"suit": "Major Arcana",
			"no": "VI",
			"img": "06.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Chariot",
			"suit": "Major Arcana",
			"no": "VII",
			"img": "07.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Strength",
			"suit": "Major Arcana",
			"no": "VIII",
			"img": "08.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Hermit",
			"suit": "Major Arcana",
			"no": "IX",
			"img": "09.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Wheel of Fortune",
			"suit": "Major Arcana",
			"no": "X",
			"img": "10.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Justice",
			"suit": "Major Arcana",
			"no": "XI",
			"img": "11.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Hanged Man",
			"suit": "Major Arcana",
			"no": "XII",
			"img": "12.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Death",
			"suit": "Major Arcana",
			"no": "XIII",
			"img": "13.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Temperance",
			"suit": "Major Arcana",
			"no": "XIV",
			"img": "14.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Devil",
			"suit": "Major Arcana",
			"no": "XV",
			"img": "15.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Tower",
			"suit": "Major Arcana",
			"no": "XVI",
			"img": "16.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Star",
			"suit": "Major Arcana",
			"no": "XVII",
			"img": "17.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Moon",
			"suit": "Major Arcana",
			"no": "XVIII",
			"img": "18.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The Sun",
			"suit": "Major Arcana",
			"no": "XIX",
			"img": "19.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Judgment",
			"suit": "Major Arcana",
			"no": "XX",
			"img": "20.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "The World",
			"suit": "Major Arcana",
			"no": "XXI",
			"img": "21.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Ace of Wands",
			"suit": "Wands",
			"no": "",
			"img": "22.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Two of Wands",
			"suit": "Wands",
			"no": "II",
			"img": "23.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Three of Wands",
			"suit": "Wands",
			"no": "III",
			"img": "24.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Four of Wands",
			"suit": "Wands",
			"no": "IV",
			"img": "25.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Five of Wands",
			"suit": "Wands",
			"no": "V",
			"img": "26.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Six of Wands",
			"suit": "Wands",
			"no": "VI",
			"img": "27.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Seven of Wands",
			"suit": "Wands",
			"no": "VII",
			"img": "28.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Eight of Wands",
			"suit": "Wands",
			"no": "VIII",
			"img": "29.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Nine of Wands",
			"suit": "Wands",
			"no": "IX",
			"img": "30.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Ten of Wands",
			"suit": "Wands",
			"no": "X",
			"img": "31.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Page of Wands",
			"suit": "Wands",
			"no": "",
			"img": "32.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Knight of Wands",
			"suit": "Wands",
			"no": "",
			"img": "33.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Queen of Wands",
			"suit": "Wands",
			"no": "",
			"img": "34.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "King of Wands",
			"suit": "Wands",
			"no": "",
			"img": "35.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Ace of Cups",
			"suit": "Cups",
			"no": "",
			"img": "36.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Two of Cups",
			"suit": "Cups",
			"no": "II",
			"img": "37.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Three of Cups",
			"suit": "Cups",
			"no": "III",
			"img": "38.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Four of Cups",
			"suit": "Cups",
			"no": "IV",
			"img": "39.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Five of Cups",
			"suit": "Cups",
			"no": "V",
			"img": "40.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Six of Cups",
			"suit": "Cups",
			"no": "VI",
			"img": "41.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Seven of Cups",
			"suit": "Cups",
			"no": "VII",
			"img": "42.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Eight of Cups",
			"suit": "Cups",
			"no": "VIII",
			"img": "43.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Nine of Cups",
			"suit": "Cups",
			"no": "IX",
			"img": "44.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Ten of Cups",
			"suit": "Cups",
			"no": "X",
			"img": "45.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Page of Cups",
			"suit": "Cups",
			"no": "",
			"img": "46.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Knight of Cups",
			"suit": "Wands",
			"no": "",
			"img": "47.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Queen of Cups",
			"suit": "Cups",
			"no": "",
			"img": "48.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "King of Cups",
			"suit": "Cups",
			"no": "",
			"img": "49.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Ace of Swords",
			"suit": "Swords",
			"no": "",
			"img": "50.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Two of Swords",
			"suit": "Swords",
			"no": "II",
			"img": "51.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Three of Swords",
			"suit": "Swords",
			"no": "III",
			"img": "52.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Four of Swords",
			"suit": "Swords",
			"no": "IV",
			"img": "53.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Five of Swords",
			"suit": "Swords",
			"no": "V",
			"img": "54.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Six of Swords",
			"suit": "Swords",
			"no": "VI",
			"img": "55.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Seven of Swords",
			"suit": "Swords",
			"no": "VII",
			"img": "56.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Eight of Swords",
			"suit": "Swords",
			"no": "VIII",
			"img": "57.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Nine of Swords",
			"suit": "Swords",
			"no": "IX",
			"img": "58.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Ten of Swords",
			"suit": "Swords",
			"no": "X",
			"img": "59.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Page of Swords",
			"suit": "Swords",
			"no": "",
			"img": "60.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Knight of Swords",
			"suit": "Swords",
			"no": "",
			"img": "61.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Queen of Swords",
			"suit": "Swords",
			"no": "",
			"img": "62.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "King of Swords",
			"suit": "Swords",
			"no": "",
			"img": "63.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Ace of Pentacles",
			"suit": "Pentacles",
			"no": "",
			"img": "64.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Two of Pentacles",
			"suit": "Pentacles",
			"no": "II",
			"img": "65.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Three of Pentacles",
			"suit": "Pentacles",
			"no": "III",
			"img": "66.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Four of Pentacles",
			"suit": "Pentacles",
			"no": "IV",
			"img": "67.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Five of Pentacles",
			"suit": "Pentacles",
			"no": "V",
			"img": "68.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Six of Pentacles",
			"suit": "Pentacles",
			"no": "VI",
			"img": "69.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Seven of Pentacles",
			"suit": "Pentacles",
			"no": "VII",
			"img": "70.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Eight of Pentacles",
			"suit": "Pentacles",
			"no": "VIII",
			"img": "71.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Nine of Pentacles",
			"suit": "Pentacles",
			"no": "IX",
			"img": "72.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Ten of Pentacles",
			"suit": "Pentacles",
			"no": "X",
			"img": "73.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Page of Pentacles",
			"suit": "Pentacles",
			"no": "",
			"img": "74.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Knight of Pentacles",
			"suit": "Pentacles",
			"no": "",
			"img": "75.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "Queen of Pentacles",
			"suit": "Pentacles",
			"no": "",
			"img": "76.jpg",
			"tags": [],
			"description": ""
		},
		{
			"name": "King of Pentacles",
			"suit": "Pentacles",
			"no": "",
			"img": "77.jpg",
			"tags": [],
			"description": ""
		},
	],
	"tags": [

	]
}

/*function load_cards() {
	$.ajax({
		url: "js/cardData.json",
		success: function( data ) {
			console.log( data );
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			console.log( errorThrown );
		}
	});
};*/

// the end.