// demo: khan academy data

require.config({
  baseUrl: 'app/kmap/scripts'
});


/*global require, KMap, $*/
require(['main'], function(KMap){
  // create the model and pass it into the views
  var graphModel = new KMap.GraphModel({allowCycles: true}),
      graphListView = new KMap.GraphListView({model: graphModel}),
      graphView,
      settings = {model: graphModel};

  var convertToKmapData = function (data) {
    var dataList = data.resource;
    var kmapData = [];

    dataList.forEach(function(nodeInfo) {
      var dependencies = [];

      if (nodeInfo.parent) {
        nodeInfo.parent.split(',').forEach(function(depId) {
          dependencies.push({
            source: depId
          });
        });
      }

      kmapData.push({
        dependencies: dependencies,
        id: nodeInfo.unit_id.toString(),
        title: nodeInfo.name,
        summary: nodeInfo.old_description
      });
    });

    return kmapData;
  };

  var handleDataFun = function (data) {

    var kmapData = convertToKmapData(data);

    // check if we're doing targeted learning
    var splitHref = window.location.href.split('#');
    if (splitHref.length > 1) {
      var target = splitHref.pop();
        // only add the subgraph to the graph
        graphModel.addJsonSubGraphToGraph(kmapData, target);
        settings.includeShortestOutlink = true;
        settings.minWispLenPx = 500;
    } else {
      // not targeted: add all the kmapData to the graph model
      graphModel.addJsonNodesToGraph(kmapData);
      settings.includeShortestDep = true;
      settings.minWispLenPx = 300;
    }

    // set some basic settings
    settings.useWisps = true;
    settings.showTransEdgesWisps = true;
    settings.showEdgeSummary = false;
    graphView = new KMap.GraphView(settings);

    // set the graph placement (don't use if 'x' and 'y' are specified in the kmapData)
    graphView.optimizeGraphPlacement(false, false);

    // render the views
    graphView.render();
    graphListView.render();

    // insert them into the html
    $('body').prepend(graphListView.$el);
    $('#graph-view-wrapper').html(graphView.$el);


    // allows correct x-browser list scrolling/svg when the window size changes
    // TODO integrate this into the view
    var $wrap = $(document.body);
    $wrap.height($(window).height());
    $(window).resize(function () {
      $wrap.height($(window).height());
    });

    var topoSortList = graphModel.getTopoSort();
    graphView.centerForNode(graphModel.getNode(topoSortList[topoSortList.length -1]));

  };

  // fetch some graph data (multiple fetches since demo_kmap is not stored in repo yet
  // $.getJSON('../data/khan_formatted.json', handleDataFun);
  // $.getJSON('../data/lc_formatted.json', handleDataFun);
  $.getJSON('../data/unit_descriptions.json', handleDataFun);

});
