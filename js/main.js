/**
 * Load TopoJSON data of the world and the data of the world wonders
 */

Promise.all([
  d3.json('data/world-110m.json'),
  d3.csv('data/world_travel.csv'),
  d3.csv('data/countries.csv')
]).then(data => {

  console.log(data[2])

  const geoMap = new GeoMap({ 
    parentElement: '#map'
  }, data[0], data[1], data[2]);
})
.catch(error => console.error(error));
