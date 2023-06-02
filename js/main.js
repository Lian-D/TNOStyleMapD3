/**
 * Load TopoJSON data of the world and the data of the world wonders
 */

Promise.all([
  d3.json('data/world-110m.json'),
  d3.csv('data/world_travel.csv'),
  d3.csv('data/countries.csv'),
  d3.csv('data/NATO+ALLY.csv'),
  d3.csv('data/BRICS.csv'),
  d3.csv('data/Displayed.csv'),
  d3.csv('data/CSTO+ALLY.csv'),
]).then(data => {

  data[3] = data[3].map( (a) => {
    return a.country
  })

  data[4] = data[4].map( (a) => {
    return a.country
  })

  data[5] = data[5].map( (a) => {
    return a.country
  })

  data[6] = data[6].map( (a) => {
    return a.country
  })


  const geoMap = new GeoMap({ 
    parentElement: '#map'
  }, data[0], data[1], data[2], data[3], data[4], data[5], data[6]);
})
.catch(error => console.error(error));
