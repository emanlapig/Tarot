// BGem Tarot Main JS

// Controller
var C = {
	cards: [],
	init: function() {
		$( "div" ).on( "touchstart", function( e ) { e.preventDefault(); e.stopPropagation(); } );
		$( ".main-menu #get-reading" ).on( "click touchstart", C.reading.init );
	},
	reading: {
		mode: "single",
		init: function() {
			V.go_to_page( ".page.reading-menu" );
			V.reading.load_decks();
			$( ".page.reading-menu #single-card" ).on( "click touchstart", C.reading.single );
		},
		single: function() {
			V.go_to_page( ".page.reading" );
			C.reading.mode = "single";
			shuffle.index = 0;
			shuffle.flip = setInterval( function() {
				$( "#card-" + shuffle.index ).addClass( "flip" );
				shuffle.index += 1;
				if ( shuffle.index === C.cards.length ) {
					clearInterval( shuffle.flip );
					shuffle.index = 0;
				}
			}, 50 );
			setTimeout( C.reading.bind_touch, 50*C.cards.length );
			$( ".page.reading #done-shuffling" ).on( "click touchstart", shuffle.collectShuffle );
		},
		bind_touch: function() {
			$( ".touch-area" ).on( "touchmove mousemove", function( e ) {
				var touchX = ( e.originalEvent.touches !== undefined )? e.originalEvent.touches[0].pageX : e.pageX,
					touchY = ( e.originalEvent.touches !== undefined )? e.originalEvent.touches[0].pageY : e.pageY,
					cardWidth = .05 * window.innerWidth,
					boxWidth = Math.floor( cardWidth * 13 ),
					sideMargin = Math.floor( ( window.innerWidth - boxWidth ) / 2 );
				for ( var i=0; i<C.cards.length; i++ ) {
					if ( 
						touchX > C.cards[i][0]-cardWidth &&
						touchX < C.cards[i][1]+cardWidth &&
						touchY > C.cards[i][2]-cardWidth*1.5 &&
						touchY < C.cards[i][3]+cardWidth*1.5
					) {
						var x = Math.floor( random( 0, window.innerWidth - cardWidth ) ),
							y = Math.floor( random( 0, window.innerHeight - cardWidth*1.5 ) );
						C.cards[i] = [
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
	}
};

// View
var V = {
	reading: {
		load_decks: function() {
			for ( var i=0; i<M.cards.length; i++ ) {
				var card = document.createElement( "div" );
				card.setAttribute( "class", "card" );
				card.setAttribute( "id", "card-" + i );
				card.setAttribute( "data-card", i );
				card.innerHTML = "<img src='img/decks/UWaite/" + i + ".jpg' />";
				$( ".reading" ).append( card );
				var cardWidth = .05 * window.innerWidth,
					boxWidth = Math.floor( cardWidth * 13 ),
					sideMargin = Math.floor( ( window.innerWidth - boxWidth ) / 2 ),
					x = Math.floor( i%13 * ( cardWidth ) + sideMargin ),
					y = Math.floor( Math.floor( i/13 ) * window.innerHeight/7 );
				C.cards.push([ 
					x,
					x + cardWidth,
					y,
					y + cardWidth*1.5,
					i
				]);
				$( card ).css( { "left": x + "px", "top": y + "px" } ).on( "click touchstart", function( e ) {
					V.reading.draw_card( $( e.target ).parent().attr( "data-card" ) );
				});
			}
		},
		draw_card: function( card ) {
			console.log( card );
			if ( C.reading.mode === "single" ) {
				$( "#card-" + card ).addClass( "draw-1" );
				$( ".card:not(#card-" + card + ")" ).addClass( "collect" );
				setTimeout( function() {
					$( ".card:not(#card-" + card + ")" ).addClass( "hidden" );
					$( "#card-" + card ).removeClass( "flip" );
				}, 1000 );
			};
		},
		shuffle: {
			index: 0,
			collect: 0,
			flip: 0,
			collectShuffle: function() {
				$( ".touch-area" ).unbind();
				C.cards.sort( function( a, b ) {
					return a[0] - b[0];
				});
				shuffle.index = 0;
				shuffle.collect = setInterval( function() {
					$( "#card-" + C.cards[ shuffle.index ][4] ).css( { "top": window.innerHeight - 200 + "px", "left": shuffle.index*10 + 100 + "px", "z-index": shuffle.index } );
					shuffle.index += 1;
					if ( shuffle.index === C.cards.length ) {
						$( ".touch-area" ).css( "display", "none" );
						clearInterval( shuffle.collect );
					}
				}, 50 );
			}
		}
	},
	go_to_page: function( to ) {
		var from = $( ".page" );
		for ( var i=0; i<from.length; i++ ) {
			if ( $( from[i] ).hasClass( "show" ) ) {
				$( from[i] ).removeClass( "show" ).addClass( "hidden" );
			}
		}
		setTimeout( function() {
			$( to ).removeClass( "hidden" ).addClass( "show" );
		}, 200 );
	},
}

var shuffle = V.reading.shuffle;

function random( min, max ) {
	return Math.floor( ( Math.random() * max ) + min );
};

// Model
var M = {
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
			"name": "The High Priestess",
			"suit": "Major Arcana",
			"no": "II",
			"img": "02.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Sometimes referred to as the Papess or the Lady of the Silver Star, the High Priestess is the key card of the feminine Divine. She represents the veiled Isis, the mystery within the heart of the temple. She is the Virgin Moon and symbolizes secret knowledge. As the moon rules the ocean tides, the High Priestess rules the tides of life. Her blue gown flows with fluidity, and where garments hide her feet, a river begins to form. The crescent moon at the High Priestess's feet, a symbol of feminine power, is bathed by the ebb and flow of the primal water. Upon her breast, an equal-armed cross shows the perfect balance of the elements within her: air, fire, water, and earth. Upon her brow are the horns and disc of the Egyptian Goddess Isis. The veil of the temple in the background bears the feminine pomegranates and the masculine palm flowers, symbolizing balance between the masculine and feminine aspects of the Divine. United together, the curtain's pattern indicates the fertile creativity of the subconscious mind. The Lady is seated between the temple pillars, Boaz and Jachin; severity and mercy, in complete harmony. In her hands we can see the half hidden scroll of knowledge, the Torah, otherwise known as the Divine Laws. The High Priestess will allow access to her secrets only incrementally. But if you follow the river emerging from her robe, the stream of consciousness, you will discover more and more of her ways. You will become spiritually enlightened. The link between that which we see, and that which we do not see, is manifested through the High Priestess's wisdom.</p>"
		},
		{
			"name": "The Empress",
			"suit": "Major Arcana",
			"no": "III",
			"img": "03.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Seated majestically on her throne is a mature and beautiful woman. She is pregnant and serene, and all about her, the Earth is resplendent with the growth of summer. Crowned with a diadem of stars and carrying a golden sceptre, she is indeed the Great Mother, the Earth Goddess in manifestation. </p>"
		},
		{
			"name": "The Emperor",
			"suit": "Major Arcana",
			"no": "IV",
			"img": "04.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Hierophant",
			"suit": "Major Arcana",
			"no": "V",
			"img": "05.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Lovers",
			"suit": "Major Arcana",
			"no": "VI",
			"img": "06.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Chariot",
			"suit": "Major Arcana",
			"no": "VII",
			"img": "07.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Strength",
			"suit": "Major Arcana",
			"no": "VIII",
			"img": "08.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Hermit",
			"suit": "Major Arcana",
			"no": "IX",
			"img": "09.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Wheel of Fortune",
			"suit": "Major Arcana",
			"no": "X",
			"img": "10.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Justice",
			"suit": "Major Arcana",
			"no": "XI",
			"img": "11.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Hanged Man",
			"suit": "Major Arcana",
			"no": "XII",
			"img": "12.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Death",
			"suit": "Major Arcana",
			"no": "XIII",
			"img": "13.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Temperance",
			"suit": "Major Arcana",
			"no": "XIV",
			"img": "14.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Devil",
			"suit": "Major Arcana",
			"no": "XV",
			"img": "15.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Tower",
			"suit": "Major Arcana",
			"no": "XVI",
			"img": "16.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Star",
			"suit": "Major Arcana",
			"no": "XVII",
			"img": "17.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Moon",
			"suit": "Major Arcana",
			"no": "XVIII",
			"img": "18.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The Sun",
			"suit": "Major Arcana",
			"no": "XIX",
			"img": "19.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Judgment",
			"suit": "Major Arcana",
			"no": "XX",
			"img": "20.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "The World",
			"suit": "Major Arcana",
			"no": "XXI",
			"img": "21.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Ace of Wands",
			"suit": "Wands",
			"no": "",
			"img": "22.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Two of Wands",
			"suit": "Wands",
			"no": "II",
			"img": "23.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Three of Wands",
			"suit": "Wands",
			"no": "III",
			"img": "24.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Four of Wands",
			"suit": "Wands",
			"no": "IV",
			"img": "25.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Five of Wands",
			"suit": "Wands",
			"no": "V",
			"img": "26.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Six of Wands",
			"suit": "Wands",
			"no": "VI",
			"img": "27.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Seven of Wands",
			"suit": "Wands",
			"no": "VII",
			"img": "28.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Eight of Wands",
			"suit": "Wands",
			"no": "VIII",
			"img": "29.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Nine of Wands",
			"suit": "Wands",
			"no": "IX",
			"img": "30.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Ten of Wands",
			"suit": "Wands",
			"no": "X",
			"img": "31.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Page of Wands",
			"suit": "Wands",
			"no": "",
			"img": "32.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Knight of Wands",
			"suit": "Wands",
			"no": "",
			"img": "33.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Queen of Wands",
			"suit": "Wands",
			"no": "",
			"img": "34.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "King of Wands",
			"suit": "Wands",
			"no": "",
			"img": "35.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Ace of Cups",
			"suit": "Cups",
			"no": "",
			"img": "36.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Two of Cups",
			"suit": "Cups",
			"no": "II",
			"img": "37.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Three of Cups",
			"suit": "Cups",
			"no": "III",
			"img": "38.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Four of Cups",
			"suit": "Cups",
			"no": "IV",
			"img": "39.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Five of Cups",
			"suit": "Cups",
			"no": "V",
			"img": "40.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Six of Cups",
			"suit": "Cups",
			"no": "VI",
			"img": "41.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Seven of Cups",
			"suit": "Cups",
			"no": "VII",
			"img": "42.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Eight of Cups",
			"suit": "Cups",
			"no": "VIII",
			"img": "43.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Nine of Cups",
			"suit": "Cups",
			"no": "IX",
			"img": "44.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Ten of Cups",
			"suit": "Cups",
			"no": "X",
			"img": "45.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Page of Cups",
			"suit": "Cups",
			"no": "",
			"img": "46.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Knight of Cups",
			"suit": "Wands",
			"no": "",
			"img": "47.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Queen of Cups",
			"suit": "Cups",
			"no": "",
			"img": "48.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "King of Cups",
			"suit": "Cups",
			"no": "",
			"img": "49.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Ace of Swords",
			"suit": "Swords",
			"no": "",
			"img": "50.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Two of Swords",
			"suit": "Swords",
			"no": "II",
			"img": "51.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Three of Swords",
			"suit": "Swords",
			"no": "III",
			"img": "52.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Four of Swords",
			"suit": "Swords",
			"no": "IV",
			"img": "53.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Five of Swords",
			"suit": "Swords",
			"no": "V",
			"img": "54.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Six of Swords",
			"suit": "Swords",
			"no": "VI",
			"img": "55.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Seven of Swords",
			"suit": "Swords",
			"no": "VII",
			"img": "56.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Eight of Swords",
			"suit": "Swords",
			"no": "VIII",
			"img": "57.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Nine of Swords",
			"suit": "Swords",
			"no": "IX",
			"img": "58.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Ten of Swords",
			"suit": "Swords",
			"no": "X",
			"img": "59.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Page of Swords",
			"suit": "Swords",
			"no": "",
			"img": "60.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Knight of Swords",
			"suit": "Swords",
			"no": "",
			"img": "61.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Queen of Swords",
			"suit": "Swords",
			"no": "",
			"img": "62.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "King of Swords",
			"suit": "Swords",
			"no": "",
			"img": "63.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Ace of Pentacles",
			"suit": "Pentacles",
			"no": "",
			"img": "64.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Two of Pentacles",
			"suit": "Pentacles",
			"no": "II",
			"img": "65.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Three of Pentacles",
			"suit": "Pentacles",
			"no": "III",
			"img": "66.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Four of Pentacles",
			"suit": "Pentacles",
			"no": "IV",
			"img": "67.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Five of Pentacles",
			"suit": "Pentacles",
			"no": "V",
			"img": "68.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Six of Pentacles",
			"suit": "Pentacles",
			"no": "VI",
			"img": "69.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Seven of Pentacles",
			"suit": "Pentacles",
			"no": "VII",
			"img": "70.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Eight of Pentacles",
			"suit": "Pentacles",
			"no": "VIII",
			"img": "71.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Nine of Pentacles",
			"suit": "Pentacles",
			"no": "IX",
			"img": "72.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Ten of Pentacles",
			"suit": "Pentacles",
			"no": "X",
			"img": "73.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Page of Pentacles",
			"suit": "Pentacles",
			"no": "",
			"img": "74.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Knight of Pentacles",
			"suit": "Pentacles",
			"no": "",
			"img": "75.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "Queen of Pentacles",
			"suit": "Pentacles",
			"no": "",
			"img": "76.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
		{
			"name": "King of Pentacles",
			"suit": "Pentacles",
			"no": "",
			"img": "77.jpg",
			"tags": [],
			"description": "",
			"details:": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut dui sit amet diam dignissim dapibus. Nulla eros mauris, commodo ut arcu ac, semper accumsan metus. Sed non dignissim tellus. Quisque facilisis purus enim, in laoreet dui bibendum quis. Duis tincidunt gravida mi vitae convallis. Maecenas ut nulla imperdiet ipsum lacinia ultrices a eget diam. Sed elementum leo quis tortor scelerisque ornare. Donec posuere tortor ut pellentesque vehicula. Aliquam erat nunc, luctus eget lacus nec, hendrerit blandit massa. Sed egestas nulla in felis ultrices cursus.</p><p>In purus tortor, malesuada ac egestas quis, finibus sit amet ipsum. Cras mattis maximus massa tempor semper. Phasellus non justo egestas nunc pulvinar dignissim vitae a massa. Aenean eleifend tortor a tincidunt tempor. Curabitur augue libero, venenatis id metus eu, pellentesque dictum urna. Proin posuere, leo vel sagittis bibendum, nulla est hendrerit orci, vel lacinia risus eros nec nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus lacinia felis ut congue gravida. Nam at semper mi, a rutrum erat. Morbi quis sem non enim tristique pulvinar. Ut libero massa, tempus a metus a, consequat efficitur quam. Donec a dolor iaculis, imperdiet felis in, pretium massa. Sed et efficitur libero.</p>"
		},
	],
	"tags": [

	]
}

/*function load_cards() {
	$.ajax({
		url: "js/M.json",
		success: function( data ) {
			console.log( data );
		},
		error: function( jqXHR, textStatus, errorThrown ) {
			console.log( errorThrown );
		}
	});
};*/

// the end.