const fs = require('fs-extra');

fs.copy('node_modules/leaflet/dist/leaflet.css', 'client/leaflet.css')
	.then(fs.copy('node_modules/leaflet/dist/images', 'client/images'))
	.then(fs.copy('node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css', 'client/MarkerCluster.Default.css'))
	.then(fs.copy('node_modules/leaflet.markercluster/dist/MarkerCluster.css', 'client/MarkerCluster.css'));
