define(["events","playbackManager","dom","browser","css!./iconosd","material-icons"],function(events,playbackManager,dom,browser){"use strict";function getOsdElementHtml(){var html="";return html+='<i class="md-icon iconOsdIcon">&#xE050;</i>',html+='<div class="iconOsdProgressOuter"><div class="iconOsdProgressInner"></div></div>'}function ensureOsdElement(){var elem=osdElement;elem||(enableAnimation=browser.supportsCssAnimation(),elem=document.createElement("div"),elem.classList.add("hide"),elem.classList.add("iconOsd"),elem.classList.add("iconOsd-hidden"),elem.classList.add("volumeOsd"),elem.innerHTML=getOsdElementHtml(),iconElement=elem.querySelector("i"),progressElement=elem.querySelector(".iconOsdProgressInner"),document.body.appendChild(elem),osdElement=elem)}function onHideComplete(){this.classList.add("hide")}function showOsd(){clearHideTimeout();var elem=osdElement;dom.removeEventListener(elem,dom.whichTransitionEvent(),onHideComplete,{once:!0}),elem.classList.remove("hide"),elem.offsetWidth,requestAnimationFrame(function(){elem.classList.remove("iconOsd-hidden"),hideTimeout=setTimeout(hideOsd,3e3)})}function clearHideTimeout(){hideTimeout&&(clearTimeout(hideTimeout),hideTimeout=null)}function hideOsd(){clearHideTimeout();var elem=osdElement;elem&&(enableAnimation?(elem.offsetWidth,requestAnimationFrame(function(){elem.classList.add("iconOsd-hidden"),dom.addEventListener(elem,dom.whichTransitionEvent(),onHideComplete,{once:!0})})):onHideComplete.call(elem))}function updatePlayerVolumeState(isMuted,volume){iconElement&&(iconElement.innerHTML=isMuted?"&#xE04F;":"&#xE050;"),progressElement&&(progressElement.style.width=(volume||0)+"%")}function releaseCurrentPlayer(){var player=currentPlayer;player&&(events.off(player,"volumechange",onVolumeChanged),events.off(player,"playbackstop",hideOsd),currentPlayer=null)}function onVolumeChanged(e){var player=this;ensureOsdElement(),updatePlayerVolumeState(player.isMuted(),player.getVolume()),showOsd()}function bindToPlayer(player){player!==currentPlayer&&(releaseCurrentPlayer(),currentPlayer=player,player&&(hideOsd(),events.on(player,"volumechange",onVolumeChanged),events.on(player,"playbackstop",hideOsd)))}var currentPlayer,osdElement,iconElement,progressElement,enableAnimation,hideTimeout;events.on(playbackManager,"playerchange",function(){bindToPlayer(playbackManager.getCurrentPlayer())}),bindToPlayer(playbackManager.getCurrentPlayer())});