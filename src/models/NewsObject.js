'use strict';
/*
 * Returns the a news Object
 *
 * @param {String} the website's name
 * @param {String} the new's title
 * @param {String} the new's link
 * @param {String} the new's time
 * @return {object}
 *
 */
function NewsObject(source, title, link, time, displayTime, image){
  return {
    source:      source,
    title:       title,
    link:        link,
    time:        time,
    displayTime: displayTime,
    image:       image
  };
}

module.exports = NewsObject;
