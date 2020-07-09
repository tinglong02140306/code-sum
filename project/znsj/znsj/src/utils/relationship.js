/**辅审关系
 * @Author: wqsong
 * @Date: 2018-08-24 23:01:00
 * @Description: 处理成功
 */

jsPlumb.ready(function () {

    var instance = window.jsp = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                visible:true,
                width:11,
                length:11,
                id:"ARROW",
                events:{
                    click:function() { alert("you clicked on the arrow overlay")}
                }
            } ],
            [ "Label", {
                location: 0.1,
                id: "label",
                cssClass: "aLabel",
                events:{
                    tap:function() { //alert("hey");
                       }
                }
            }]
        ],
        Container: "canvas"
    });

    var basicType = {
        connector: "StateMachine",
        paintStyle: { stroke: "red", strokeWidth: 4 },
        hoverPaintStyle: { stroke: "blue" },
        overlays: [
            "Arrow"
        ]
    };
    instance.registerConnectionType("basic", basicType);

    // this is the paint style for the connecting lines..
    var connectorPaintStyle = {
            strokeWidth: 1,
            stroke: "blue",
            joinstyle: "round",
            outlineStroke: "white",
            outlineWidth: 2
        },
    // .. and this is the hover style.
        connectorHoverStyle = {
            strokeWidth: 3,
            stroke: "#216477",
            outlineWidth: 5,
            outlineStroke: "white"
        },
        endpointHoverStyle = {
            fill: "#216477",
            stroke: "#216477"
        },
    // the definition of source endpoints (the small blue ones)
        sourceEndpoint = {
            endpoint: "Dot",
            paintStyle: {
                stroke: "#7AB02C",
                fill: "transparent",
                radius: 7,
                strokeWidth: 1
            },
            isSource: true,
            connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
            connectorStyle: connectorPaintStyle,
            hoverPaintStyle: endpointHoverStyle,
            connectorHoverStyle: connectorHoverStyle,
            dragOptions: {},
            overlays: [
                [ "Label", {
                    location: [0.5, 1.5],
                    label: "Drag",
                    cssClass: "endpointSourceLabel",
                    visible:false
                } ]
            ]
        },
    // the definition of target endpoints (will appear when the user drags a connection)
        targetEndpoint = {
            endpoint: "Dot",
            paintStyle: { fill: "#7AB02C", radius: 7 },
            hoverPaintStyle: endpointHoverStyle,
            maxConnections: -1,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            isTarget: true,
            overlays: [
                [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ],
            ]
        },
        init = function (connection,y) {
          for(var i=0;i<y.length;i++){
            var uid = "flowchart" + y[i].uid
            if(uid == connection.targetId) {
              var nm = y[i].n
              if(nm == ""){
                return false
              }else{
                connection.getOverlay("label").setLabel(nm);

              }
            }
          }
        };

    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint("flowchart" + toId, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
        }
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
        }
    };

    // suspend drawing and initialise.
    instance.batch(function () {
        var listleft = [
        {n:'',name:'张三',select:'0',uid:"Window1",top:'600px',left:'650px',show:["LeftMiddle","RightMiddle","TopCenter","BottomCenter"],hide:''},
        {n:'就职',name:'企业信息',select:'1',uid:"Window2",top:'745px',left:'285px',x:'470',y:'785',show:["LeftMiddle","TopCenter","BottomCenter"],hide:["RightMiddle"]},
        {n:'',name:'低保信息',select:'1',uid:"Window3",top:'350px',left:'395px',show:["LeftMiddle","TopCenter","RightMiddle"],hide:["BottomCenter"]},
        {n:'持有',name:'房产信息',select:'1',uid:"Window4",top:'700px',left:'930px',show:["RightMiddle","TopCenter","BottomCenter"],hide:["LeftMiddle"]},
        {n:'持有',name:'车辆信息',select:'1',uid:"Window5",top:'380px',left:'650px',show:["LeftMiddle","RightMiddle","TopCenter"],hide:["BottomCenter"]},
        {n:'缴纳',name:'公积金信息',select:'1',uid:"Window6",top:'800px',left:'650px',show:["LeftMiddle","RightMiddle","BottomCenter"],hide:["TopCenter"]},
        {n:'参保',name:'社保信息',select:'1',uid:"Window7",top:'495px',left:'1040px',show:["RightMiddle","TopCenter","BottomCenter"],hide:["LeftMiddle"]},

      ]
      for(var i=0;i<listleft.length;i++){
          _addEndpoints(listleft[i].uid, listleft[i].show, listleft[i].hide);
      }



        // listen for new connections; initialise them the same way we initialise the connections at startup.
        instance.bind("connection", function (connInfo, originalEvent) {
            init(connInfo.connection,listleft);
        });

        // make all the window divs draggable
        instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
        // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
        // method, or document.querySelectorAll:
        //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

        // connect a few up

        instance.connect({uuids: ["Window1RightMiddle", "Window7LeftMiddle"], editable: true});
        instance.connect({uuids: ["Window1RightMiddle", "Window4LeftMiddle"], editable: true});
        instance.connect({uuids: ["Window1TopCenter", "Window5BottomCenter"], editable: true});
        instance.connect({uuids: ["Window1BottomCenter", "Window6TopCenter"], editable: true});
        instance.connect({uuids: ["Window1LeftMiddle", "Window3BottomCenter"], editable: true});
        instance.connect({uuids: ["Window1LeftMiddle", "Window2RightMiddle"], editable: true});


        //
        // listen for clicks on connections, and offer to delete connections on click.
        //
        instance.bind("click", function (conn, originalEvent) {
           // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
             //   instance.detach(conn);
            //conn.toggleType("basic");
        });

        instance.bind('beforeDrop', function (conn) {
          if (conn.sourceId === conn.targetId) {
            return false
          } else {
            return true
          }
        })
        instance.bind("connectionDrag", function (connection) {
            console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
        });

        instance.bind("connectionDragStop", function (connection) {
            console.log("connection " + connection.id + " was dragged");
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connection " + params.connection.id + " was moved");
        });

    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);

});
