const URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

const svgwidth = 1080;
const svgheight = 700;
const padding = 50;

//call api by http
const req = new XMLHttpRequest();
req.open("GET", URL, true);
req.send();
req.onload = function() {
  const json = JSON.parse(req.responseText);
  var dataset = json.data;

  //creando elementos contenedores
  d3.select("body")
    .attr("class", "container")
    .append("h1")
    .attr("class", "mt-5")
    .attr("id", "title")
    .text("United States GDP");
  d3.select("body").append("svg");

  //calculando ancho basado en la cantidad de elementos a mostrar
  const barWidth = (svgwidth - padding * 2) / dataset.length;

  //creando marco canvas
  const svg = d3
    .select("svg")
    .attr("width", svgwidth)
    .attr("height", svgheight);

  //definiendo escala a utilizar en el eje X tiempo
  const xScale = d3
    .scaleTime()
    .domain([
      new Date(d3.min(dataset, d => d[0])),
      new Date(d3.max(dataset, d => d[0]))
    ])
    .range([padding, svgwidth - padding]);

  //definiendo escala a utilizar en el eje Y cantidad
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([svgheight - padding, padding]);

  //asignando ejes definiendo su tamaño dinamico
  const xAxes = d3.axisBottom(xScale);
  const yAxes = d3.axisLeft(yScale);

  //agregando ejes al canvas
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (svgheight - padding) + ")")
    .call(xAxes);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxes);

  //agrengando tooltip
  /*const info = d3
    .select("body")
    .append("div")
    .attr("class", "")
    .attr("id", "tooltip");*/
  svg
    .append("text")
    .attr("x", 100)
    .attr("y", 100)
    .attr("id", "tooltip").attr("class", "lead")

  //creando elementos rectangulares por cada dato a mostrar
  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .style("fill", "purple")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("y", d => yScale(d[1]))
    .attr("x", (d, i) => padding + i * barWidth)
    .attr("height", (d, i) => svgheight - padding - yScale(d[1]))
    .attr("width", barWidth)
    //tooltip segun evento del mouse
    .on("mouseover", function(d, i) {
      $("#tooltip").show();
      d3.select("#tooltip")
        .attr("data-date", d[0])
        .text(function() {
          let date = new Date(d[0]);
          let Q = date.getMonth();
          return (
            date.getFullYear() +
            " Q" +
            Math.ceil(Q / 3) +
            "\nGDP $" +
            d[1] +
            " Billion"
          );
        });
    })
    .on("mouseout", function() {
      $("#tooltip").hide();
    });

  /*
    .append("title")
    .attr('data-toggle','tooltip')
    .attr("data-date", d => d[0])
    .attr("id", "tooltip")
    .text(d => {
        let date = new Date(d[0]);
        let Q = date.getMonth()
        return date.getFullYear() + " Q" +Math.ceil(Q/3) + "\nGDP $" + d[1] + " Billion";
    });

     */
  //.attr("transform", (d, i) => {      let translate = [barWidth * i, 0];      return "translate(" + translate + ")";    });
};
