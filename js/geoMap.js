class GeoMap {
  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _geoData, _data, _mapdata, _NATO, _BRICS, _display, _CSTO) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1800,
      containerHeight: _config.containerHeight || 800,
      margin: _config.margin || { top: 0, right: 0, bottom: 0, left: 0 },
      tooltipPadding: 10,
    };
    this.geoData = _geoData;
    this.data = _data;
    this.mapdata = _mapdata;
    this.nato = _NATO;
    this.brics = _BRICS;
    this.csto = _CSTO;
    this.display = _display;
    this.initVis();
  }

  getDarkColor() {
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 10);
    }
    return color;
  }

  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;
    // console.log(this.mapdata);

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .append('svg')
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight)
      .attr('display', 'block')
      .style('margin', 'auto');

    // Append group element that will contain our actual chart
    // and position it according to the given margin config
    vis.chart = vis.svg
      .append('g')
      .attr(
        'transform',
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    // Defines the scale and translate of the projection so that the geometry fits within the SVG area
    // We crop Antartica because it takes up a lot of space that is not needed for our data
    vis.projection = d3
      .geoCylindricalStereographic()
      .rotate([-10, 0])
      .center([0, 25]) // set centre to further North
      .scale([vis.width / (2 * Math.PI)]) // scale to fit size of svg group
      .translate([vis.width / 2, vis.height / 2]); // ensure centered wit hin svg group

    vis.geoPath = d3.geoPath().projection(vis.projection);

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    // Append world map
    const geoPath = vis.chart
      .selectAll('.geo-path')
      .data(
        topojson.feature(vis.geoData, vis.geoData.objects.countries).features
      )
      .join('path')
      .attr('class', 'geo-path')
      .attr('d', vis.geoPath)
      .attr('fill', '#horizontal-stripe-9')
      .attr('fill', (d) => {
        console.log(vis.csto);
        if (vis.nato.includes(d.properties.name)) {
          return '#153043';
        } else if (vis.csto.includes(d.properties.name)) {
          return '#100000';
        } else if (vis.brics.includes(d.properties.name)) {
          return '#300000'
        }
        else {
          // return this.getDarkColor();
          return '#333333';
        }
      });

    // Append country borders
    const geoBoundaryPath = vis.chart
      .selectAll('.geo-boundary-path')
      .data([topojson.mesh(vis.geoData, vis.geoData.objects.countries)])
      .join('path')
      .attr('class', 'geo-boundary-path')
      .attr('d', vis.geoPath);

    // Append symbols
    const geoSymbols = vis.chart
      .selectAll('.geo-symbol')
      .data(vis.data)
      .join('circle')
      .attr('class', (d) => {
        return 'geo-symbol-capital';
      })
      .attr('r', 2)
      .attr('cx', (d) => vis.projection([d.lon, d.lat])[0])
      .attr('cy', (d) => vis.projection([d.lon, d.lat])[1]);

    // Tooltip event listeners
    geoSymbols
      .on('mousemove', (event, d) => {
        d3
          .select('#tooltip')
          .style('display', 'block')
          .style('left', `${event.pageX + vis.config.tooltipPadding}px`)
          .style('top', `${event.pageY + vis.config.tooltipPadding}px`).html(`
              <div class="tooltip-title">${d.country}</div>
              <div>${d.capital}&nbsp; | &nbsp;${d.continent}</div>
            `);
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      });

    // Append text labels with the number of visitors for two sights (to be used as a legend)
    const geocountryLabels = vis.chart
      .selectAll('.geo-label')
      .data(vis.mapdata)
      .join('text')
      .attr('class', 'geo-label')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('x', (d) => {
        return vis.projection([d.lon, d.lat])[0];
      })
      .attr('y', (d) => {
        return vis.projection([d.lon, d.lat])[1];
      })
      .text((d) => {
        if (
          vis.display.includes(d.name)
        ) {
          return `${d.name}`;
        }
      });
  }
}
