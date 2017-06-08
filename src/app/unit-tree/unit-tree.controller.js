(function() {
  'use strict';

  function UnitTreeController($rootScope, VisDataSet, UNIT_DESCRIPTIONS, $stateParams) {
    var vm = this;
    var visNetwork;
    var initialScale;
    // var lastScale;
    var lastViewPosition;
    var allNodes;
    var focusedNodes;
    var selectedNode = $stateParams.node;
    var gradeLabelMap = {
      3: '초3', 4: '초4', 5: '초5', 6: '초6',
      7: '중1', 8: '중2', 9: '중3'
    };

    vm.visOptions = {
      nodes: {
        shape: 'dot',
        color: {
          background: '#C5E1A5',
          border: '#8BC34A'
        },
        scaling: {
          label: {
            enabled: true,
            min: 22
          }
        }
      },
      edges: {
        smooth: {
          type: 'cubicBezier',
          forceDirection: 'vertical',
          roundness: 0.8
        },
        arrows: {
          to: true
        }
      },
      layout: {
        hierarchical: {
          direction: 'UD',
          nodeSpacing: 200,
          treeSpacing: 400
          // levelSeparation: 300
        }
      },
      interaction: {
        hover: true
      },
      autoResize: true,
      height: '800px',
      physics: false
    };

    vm.visEvents = {
      onload: function(network) {
        visNetwork = network;
        initialScale = visNetwork.getScale();
        lastViewPosition = visNetwork.getViewPosition();

        if (selectedNode) {
          UNIT_DESCRIPTIONS.resource.forEach(function(unitData) {
            if (unitData.name === selectedNode) {
              visNetwork.focus(unitData.unit_id, {
                scale: initialScale * 2,
                animation: {
                  duration: 1000,
                  easingFunction: 'easeInOutQuad'
                }
              });
            }
          });
        }
      },
      selectNode: function(nodeObj) {
        if (visNetwork) {
          makeFocusView(nodeObj);

          // if (visNetwork.getScale() < initialScale * 2) {
          //   lastViewPosition = visNetwork.getViewPosition();
          //   lastScale = visNetwork.getScale();
          // }

          // // zoom in
          // visNetwork.focus(nodeObj.nodes[0], {
          //   scale: initialScale * 2,
          //   animation: {
          //     duration: 1000,
          //     easingFunction: 'easeInOutQuad'
          //   }
          // });
        }
      },
      deselectNode: function(ctxInfo) {
        if (visNetwork) {
          if (ctxInfo.nodes.length === 0) {
            // focus out
            visNetwork.setData(allNodes);
          }
        }

        // if (visNetwork) {
        //   if (ctxInfo.nodes.length === 0) {
        //     // zoom out
        //     visNetwork.moveTo({
        //       scale: lastScale || initialScale,
        //       position: lastViewPosition,
        //       animation: {
        //         duration: 1000,
        //         easingFunction: 'easeInOutQuad'
        //       }
        //     });
        //   }
        // }
      }
    };

    initNodesAndEdges();

    function initNodesAndEdges() {
      var nodes = [];
      var edges = [];

      UNIT_DESCRIPTIONS.resource.forEach(function(unitData) {
        nodes.push({
          id: unitData.unit_id,
          label: unitData.name + ' (' + gradeLabelMap[unitData.grade_id] + ')',
          level: unitData.layer,
          value: 50,
          size: 30,
          title: '<div class="panel panel-default vis-tooltip-box">' +
          '<div class="panel-heading">' +
          '<h4>' + unitData.name + ' (' + gradeLabelMap[unitData.grade_id] + ')</h4>' +
          '<h5>' + unitData.domain + '</h5></div>' +
          '<div class="panel-body">' + unitData.old_description + '</div>' +
          '</div>'
        });

        if (unitData.parent) {
          unitData.parent.split(',').forEach(function(parentId) {
            edges.push({
              from: parseInt(parentId),
              to: unitData.unit_id
            });
          });
        }
      });

      allNodes = {
        nodes: nodes,
        edges: edges
      };

      vm.visData = allNodes;
    }

    function makeFocusView(selectedNode) {
      // 1. get connected nodes
      // 2. figure out which nodes are parent and child
      // 3. move the connected nodes based on current selected node
      // 4. save those moved nodes so we can move them back to their original position later
      var nodes = [];
      var edges = [];
      var connectedNodeIds = visNetwork.getConnectedNodes(selectedNode.nodes[0]);
      var connNodePositions = visNetwork.getPositions(connectedNodeIds);
      var baseLevel = 2;
      var baseY = selectedNode.pointer.canvas.y;

      UNIT_DESCRIPTIONS.resource.forEach(function(unitData) {
        if (unitData.unit_id === selectedNode.nodes[0] || connectedNodeIds.indexOf(unitData.unit_id) !== -1) {
          var level;

          if (unitData.unit_id === selectedNode.nodes[0]) {
            level = baseLevel;
          } else if (connNodePositions[unitData.unit_id].y < baseY) {
            level = 1;
          } else {
            level = 3;
          }

          nodes.push({
            id: unitData.unit_id,
            label: unitData.name + ' (' + gradeLabelMap[unitData.grade_id] + ')',
            level: level,
            value: 50,
            size: 30,
            title: '<div class="panel panel-default vis-tooltip-box">' +
            '<div class="panel-heading">' +
            '<h4>' + unitData.name + ' (' + gradeLabelMap[unitData.grade_id] + ')</h4>' +
            '<h5>' + unitData.domain + '</h5></div>' +
            '<div class="panel-body">' + unitData.old_description + '</div>' +
            '</div>'
          });

          if (unitData.parent) {
            unitData.parent.split(',').forEach(function(parentId) {
              edges.push({
                from: parseInt(parentId),
                to: unitData.unit_id
              });
            });
          }
        }
      });

      focusedNodes = {
        nodes: nodes,
        edges: edges
      };

      visNetwork.setData(focusedNodes);
      visNetwork.selectNodes([selectedNode.nodes[0]]);
    }
  }

  UnitTreeController.$inject = ['$rootScope', 'VisDataSet', 'UNIT_DESCRIPTIONS', '$stateParams'];

  angular.module('maestro.unitTree.controller.UnitTreeController', [])
      .controller('UnitTreeController', UnitTreeController);
})();