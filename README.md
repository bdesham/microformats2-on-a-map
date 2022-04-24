# Microformats2 on a Map

A web application to extract [microformats2]-formatted locations from webpages and display them on a map.

⚠️ **Notice:** This project is no longer maintained. It may have severe security or compatibility problems. Use it at your own risk!

[microformats2]: http://microformats.org

## How to use it

Enter some HTML in the text box and click the “Map these microformats” button. The app will convert instances of the [`h-adr`][adr] and [`h-geo`][geo] microformats into locations and display them on the map. (This process may take a minute, so please be patient!)

[adr]: http://microformats.org/wiki/h-adr
[geo]: http://microformats.org/wiki/h-geo

You also have the option to enter one or more URLs into the text box. When you click “Map these microformats,” the app will fetch each page in turn and add all of the locations it finds to the map.

<img src="https://github.com/bdesham/microformats2-on-a-map/raw/main/screenshot.png" alt="Screenshot of the application" width="600" height="391"/>

In either case, clicking one of the markers on the map will show a popup with the corresponding address. If there are multiple markers in the same area, they will be coalesced into a colorful circle with a number on it. If you click this circle then the map will zoom in (if there are markers at multiple locations) or expand the markers so that you can see them individually.

## Where to use it

### Running locally with Node

You can run the app on your own computer as long as you have Node.js installed. (It was written against Node.js 10.15; it may be incompatible with earlier or later versions.) Just clone this repository and then run the following commands:

1. `npm install`
2. `npm start`

The application will be viewable at [http://localhost:8000](http://localhost:8000).

You can run `npm test` to run the tests.

If you’re going to be modifying the client-side code, run `npm run dev` instead of `npm start` so that the client-side bundle will be rebuilt each time you change the client-side files.

### Running locally with Docker

Alternatively, if you don’t want to install Node but you have Docker installed, you can use this app through Docker. Clone this repository and run

    docker build -t bdesham/microformats2-on-a-map .

to build the Docker image. Then, you can run

    docker run -p 8000:8000 -d bdesham/microformats2-on-a-map

to start the app in the background, or

    docker run -p 8000:8000 -it bdesham/microformats2-on-a-map

to start the app in the foreground (as if you had just run `npm start` normally). In either case, the app will be viewable at [http://localhost:8000](http://localhost:8000).

If you’re going to be modifying the code you’ll want to connect your local copy of the repository to `/app` in the Docker container. You can do this with the flag `-v "$PWD:/app"`. For example, if you want to make local changes and then run the tests, you could run

    docker run -it -v "$PWD:/app" bdesham/microformats2-on-a-map sh -c 'npm test'

If you want to serve the application, rebuilding the client-side bundle whenever you change the client-side files, run

    docker run -p 8000:8000 -it -v "$PWD:/app" bdesham/microformats2-on-a-map npm run dev

You could also run

    docker run -p 8000:8000 -it -v "$PWD:/app" bdesham/microformats2-on-a-map sh

if you want a full-fledged shell within the Docker container. From that shell you can run `npm run dev`, `npm test`, or any other command you’d like.

## Limitations

This project is a tech demo and there are significant improvements that could be made to both the user experience and the behind-the-scenes code. Some outstanding issues are listed [in the issue tracker][issues]. However, this project is **no longer maintained** and I do not intend to work on it further.

[issues]: https://github.com/bdesham/microformats2-on-a-map/issues

## Author

This program was created by [Benjamin Esham](https://esham.io).

This project is [hosted on GitHub](https://github.com/bdesham/microformats2-on-a-map). It is **no longer being developed** and is left on GitHub only in the hope that someone will find the code interesting or useful.

## Version history

* 0.9.0 (2017-09-10): Initial release.

## License

This application displays map data from [OpenStreetMap], including through the [Nominatim] service. This information is © OpenStreetMap contributors.

[OpenStreetMap]: http://openstreetmap.org/
[Nominatim]: https://wiki.openstreetmap.org/wiki/Nominatim

The application itself is released under the following terms:

Copyright © 2017, 2019 Benjamin D. Esham.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but **without any warranty;** without even the implied warranty of **merchantability** or **fitness for a particular purpose.** See the GNU General Public License for more details.

The GNU General Public License can be found in the file COPYING.
