FROM grafana/grafana:latest

RUN  grafana-cli plugins install grafana-worldmap-panel \
  && grafana-cli plugins install grafana-clock-panel \
  && grafana-cli plugins install grafana-piechart-panel \
  && grafana-cli plugins install grafana-simple-json-datasource \
  && grafana-cli plugins install satellogic-3d-globe-panel \
  && grafana-cli plugins install natel-discrete-panel \
  && grafana-cli plugins install jdbranham-diagram-panel \
  && grafana-cli plugins install natel-plotly-panel