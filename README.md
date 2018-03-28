# Microformats2 on a Map [![Build Status](https://travis-ci.org/bdesham/microformats2-on-a-map.svg?branch=master)](https://travis-ci.org/bdesham/microformats2-on-a-map)

A web application to extract [microformats2]-formatted locations from webpages and display them on a map.

[microformats2]: http://microformats.org

<img src="https://github.com/bdesham/microformats2-on-a-map/raw/master/screenshot.png" alt="Screenshot of the application" width="836"/>

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

This is very much a work in progress. The outstanding issues are listed [in the issue tracker][issues].

[issues]: https://github.com/bdesham/microformats2-on-a-map/issues

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
