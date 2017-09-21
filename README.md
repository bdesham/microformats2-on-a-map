# Microformats2 on a Map

A web application to extract [microformats2]-formatted locations from webpages and display them on a map.

[microformats2]: http://microformats.org

<center><img src="https://github.com/bdesham/microformats2-on-a-map/raw/master/screenshot.png" alt="Screenshot of the application" width="836"/></center>

## How to use it

Enter some HTML in the text box and click the “Map these microformats” button. The app will convert instances of the [`h-adr`][adr] and [`h-geo`][geo] microformats into locations and display them on the map. (This process may take a minute, so please be patient!)

[adr]: http://microformats.org/wiki/h-adr
[geo]: http://microformats.org/wiki/h-geo

If you’re running your own copy of the app you’ll also have the option to enter one or more URLs into the text box. When you click “Map these microformats,” the app will fetch each page in turn and add all of the locations it finds to the map.

In either case, clicking one of the markers on the map will show a popup with the corresponding address. If there are multiple markers in the same area, they will be coalesced into a colorful circle with a number on it. If you click this circle then the map will zoom in (if there are markers at multiple locations) or expand the markers so that you can see them individually.

## Where to use it

You can use [this hosted version of the app][app] right in your browser. Because of [CORS] restrictions, though, you will only be able to enter the HTML for one page; you won’t be able to enter multiple URLs to scan.

[app]: https://esham.io/projects/microformats2-on-a-map
[CORS]: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing

You can also run the app on your own computer (or server) as long as you have Node.js installed. Just clone this repository and then run the following commands:

1. `npm install`
2. `npm start`

The application will be viewable at [http://localhost:8000](http://localhost:8000). If you’re going to be modifying the client-side code, replace the second command with `npm run dev` so that the client-side bundle will be rebuilt each time you change the client-side files.

## Current limitations

This is very much a work in progress. Things that need to be improved:

- Error handling is basically non-existent.
- Parsing and geocoding can take a while and no feedback is provided to the user as it’s happening.
- Nested microformats are not currently found by the parser, so if there is an `h-adr` inside an `h-entry` (for example) then this address will not end up on the map.
- The information shown when the user clicks on a map marker is pretty minimal, and may not provide enough context to understand where that marker came from.
- The app is basically unusable on screens narrower than 900&nbsp;px or so.
- In order to comply with the [usage policies][policies] for Nominatim, which provides geocoding, there should be a one-second delay between geocoding requests. (This needs to be set up to take advantage of the cache.)
- I have not tested which browsers this is compatible with. I have used ES6 syntax pretty freely, and this isn’t ever transpiled to ES5; it may be necessary to add Babel or Google Closure Compiler to the build process to make the application compatible with older browsers.

[policies]: https://operations.osmfoundation.org/policies/nominatim/

## Author

This program was created by [Benjamin Esham](https://esham.io).

This project is [hosted on GitHub](https://github.com/bdesham/microformats2-on-a-map). Please feel free to submit pull requests.

## Version history

* 0.9.0 (2017-09-10): Initial release.

## License

This application displays map data from [OpenStreetMap], including through the [Nominatim] service. This information is © OpenStreetMap contributors.

[OpenStreetMap]: http://openstreetmap.org/
[Nominatim]: https://wiki.openstreetmap.org/wiki/Nominatim

The application itself is released under the following terms:

Copyright © 2017 Benjamin D. Esham.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but **without any warranty;** without even the implied warranty of **merchantability** or **fitness for a particular purpose.** See the GNU General Public License for more details.

The GNU General Public License can be found in the file COPYING.
