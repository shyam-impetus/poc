jsPlumb.ready(function () {
    var elementCount = 0,
        jsPlumbInstance,
        basicType,
        startEndPoints,
        properties,
        clicked = false,
        savedData = [];

    var connectorPaintStyle,
        connectorHoverStyle,
        endpointHoverStyle,
        sourceEndpoint,
        targetEndpoint;

    var colors = {
        connectingLines: "#61B7CF",
        connectorHover: "#216477",
        connectorOutline: "white",
        endpointHover: "#216477",
        sourceEndpointStroke: "#7AB02C",
        targetEndpointFill: "#7AB02C"
    }

    jsPlumbInstance = jsPlumb.getInstance({
        //Default drag options
        DragOptions: {
            cursor: 'pointer',
            zIndex: 2000
        },
        //the arrow overlay for the connection
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                visible: true,
                id: "ARROW"
            }]
        ],
        Container: "canvas"
    });

    //define basic connection type
    basicType = {
        connector: "StateMachine"
    };
    jsPlumbInstance.registerConnectionType("basic", basicType);

    // this is the paint style for the connecting lines..
    connectorPaintStyle = {
        strokeWidth: 2,
        stroke: colors.connectingLines,
        joinstyle: "round",
        outlineStroke: colors.connectorOutline,
        outlineWidth: 2
    };

    //this is the hover style.
    connectorHoverStyle = {
        strokeWidth: 3,
        stroke: colors.connectorHover,
        outlineWidth: 5,
        outlineStroke: colors.connectorOutline,
    };
    endpointHoverStyle = {
        fill: colors.connectorOutline,
        stroke: colors.connectorOutline
    };

    // the definition of source endpoints (the small blue ones)
    sourceEndpoint = {
        endpoint: "Dot",
        paintStyle: {
            stroke: colors.sourceEndpointStroke,
            fill: "transparent",
            radius: 7,
            strokeWidth: 1
        },
        isSource: true,
        connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
        connectorStyle: connectorPaintStyle,
        hoverPaintStyle: endpointHoverStyle,
        connectorHoverStyle: connectorHoverStyle,
        dragOptions: {},
        overlays: [
            ["Label", {
                location: [0.5, 1.5],
                label: "Drag",
                cssClass: "endpointSourceLabel",
                visible: false
            }]
        ]
    };

    // the definition of target endpoints (will appear when the user drags a connection)
    targetEndpoint = {
        endpoint: "Dot",
        paintStyle: { fill: colors.targetEndpointFill, radius: 7 },
        hoverPaintStyle: endpointHoverStyle,
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true,
        overlays: [
            ["Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible: false }]
        ]
    };

    startEndPoints = {
        start: {
            startpoints: ["BottomCenter"],
            endpoints: [],
            contenteditable: false
        },
        step: {
            startpoints: ["BottomCenter"],
            endpoints: ["TopCenter"],
            contenteditable: true
        },
        diamond: {
            startpoints: ["LeftMiddle", "RightMiddle", "BottomCenter"],
            endpoints: ["TopCenter"],
            contenteditable: true
        },
        end: {
            startpoints: [],
            endpoints: ["TopCenter"],
            contenteditable: false
        }
    };

    //Event registering --- 
    makeDraggable("#startEv", "window start jsplumb-connected custom", "start");
    makeDraggable("#stepEv", "window step jsplumb-connected-step custom", "step");
    makeDraggable("#endEv", "window start jsplumb-connected-end custom", "end");

    $("#descEv").draggable({
        helper: function () {
            return createElement("");
        },
        stack: ".custom",
        revert: false
    });

    $("#canvas").droppable({
        accept: ".window",
        drop: function (event, ui) {
            ui.helper.clone().appendTo(this);
        }
    });

    //load properties of a start element once the step element in the palette is clicked
    $('#startEv').mousedown(function () {
        loadProperties("window start custom jtk-node jsplumb-connected", "5em", "5em", "start", startEndPoints.start.startpoints, startEndPoints.start.endpoints, false);
        clicked = true;
    });

    //load properties of a step element once the step element in the palette is clicked
    $('#stepEv').mousedown(function () {
        loadProperties("window step custom jtk-node jsplumb-connected-step", "5em", "5em", "step", startEndPoints.step.startpoints, startEndPoints.step.endpoints, true);
        clicked = true;
    });

    //load properties of a decision element once the decision element in the palette is clicked
    $('#descEv').mousedown(function () {
        loadProperties("window diamond custom jtk-node jsplumb-connected-step", "5em", "5em", "decision", startEndPoints.diamond.startpoints, startEndPoints.diamond.endpoints, true, 100, 100);
        clicked = true;
    });

    //load properties of a end element once the end element in the palette is clicked
    $('#endEv').mousedown(function () {
        loadProperties("window end custom jtk-node jsplumb-connected-end", "5em", "5em", "end", startEndPoints.end.startpoints, startEndPoints.end.endpoints, false);
        clicked = true;
    });

    $("#canvas").droppable({
        accept: ".window",
        drop: function (event, ui) {
            if (clicked) {
                clicked = false;
                elementCount++;

                var xPos = ui.offset.left - $(this).offset().left;
        var yPos = ui.offset.top - $(this).offset().top;

        properties[0].left = xPos;
        properties[0].top = yPos;

                var name = "Window" + elementCount;
                var id = "flowchartWindow" + elementCount;
                element = createElement(id);
                drawElement(element, "#canvas", id);
                element = "";
            }
        }
    });

    $('#canvas').on('click', function (e) {
        $(".jtk-node").css({ 'outline': "none" });
        $(".close-icon").hide();
        if (e.target.nodeName == "P") {
            e.target.parentElement.parentElement.style.outline = "4px solid red";
        } else if (e.target.nodeName == "STRONG") {
            e.target.parentElement.style.outline = "4px solid red";
        } else if (e.target.getAttribute("class") != null && e.target.getAttribute("class").indexOf("jtk-node") > -1) {//when clicked the step, decision or i/o elements
            e.target.style.outline = "4px solid red";
        }
    });

    $(document).on("click", ".custom", function () {
        if ($(this).attr("class").indexOf("diamond") == -1) {
            var marginLeft = $(this).outerWidth() + 8 + "px";
            $(".close-icon").prop("title", "Delete the element");
            $(this).find("i").css({ 'margin-left': "50px", 'margin-top': "-50px", 'position': "absolute" }).show();
        } else {
            $(this).find("i").css({ 'margin-left': "5px", 'margin-top': "-65px", 'position': "absolute" }).show();
        }
    });

    $(document).on("click", ".close-icon", function () {
        jsPlumbInstance.remove($(this).parent().attr("id"));
    });

    //Private functions --- 
    function makeDraggable(id, className, text) {
        $(id).draggable({
            helper: function () {
                return $("<div/>", {
                    text: text,
                    class: className
                });
            },
            stack: ".custom",
            revert: false
        });
    }

    function loadProperties(clsName, left, top, label, startpoints, endpoints, contenteditable) {
        properties = [];
        properties.push({
            left: left,
            top: top,
            clsName: clsName,
            label: label,
            startpoints: startpoints,
            endpoints: endpoints,
            contenteditable: contenteditable
        });
    }

    //create an element to be drawn on the canvas
    function createElement(id, props) {
        if (props) {
            properties = [props];
            id = props.id;
        }
        var elm = $('<div>').addClass(properties[0].clsName).attr('id', id);
        if (properties[0].clsName.indexOf("diamond") > -1) {
            elm.outerWidth("100px");
            elm.outerHeight("100px");
        }

        elm.css({
            'top': properties[0].top,
            'left': properties[0].left
        });

        var strong = $('<strong>');
        if (properties[0].clsName == "window diamond custom jtk-node jsplumb-connected-step") {
            elm.append("<i style='display: none; margin-left: -5px; margin-top: -50px' " +
                "class=\"fa fa-trash fa-lg close-icon desc-text\"><\/i>");
            var p = "<p style='line-height: 110%; margin-top: 25px' class='desc-text' contenteditable='true' " +
                "ondblclick='$(this).focus();'>" + properties[0].label + "</p>";
            strong.append(p);
        }
        else if (properties[0].clsName == "window parallelogram step custom jtk-node jsplumb-connected-step") {
            elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon input-text\"><\/i>");
            var p = "<p style='line-height: 110%; margin-top: 25px' class='input-text' contenteditable='true' " +
                "ondblclick='$(this).focus();'>" + properties[0].label
                + "</p>";
            strong.append(p);
        }
        else if (properties[0].contenteditable) {
            elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon\"><\/i>");
            var p = "<p style='line-height: 110%; margin-top: 25px' contenteditable='true' " +
                "ondblclick='$(this).focus();'>" + properties[0].label + "</p>";
            strong.append(p);
        } else {
            elm.append("<i style='display: none' class=\"fa fa-trash fa-lg close-icon\"><\/i>");
            var p = $('<p>').text(properties[0].label);
            strong.append(p);
        }
        elm.append(strong);
        return elm;
    }

    function drawElement(element, canvasId, name) {
        $(canvasId).append(element);
        _addEndpoints(name, properties[0].startpoints, properties[0].endpoints);
        jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
            grid: [20, 20]
        });
    }
    function _addEndpoints(toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            _addSourceEndPoint(toId, sourceAnchors[i]);
        }
        for (var i = 0; i < targetAnchors.length; i++) {
            _addTargetEndPoint(toId, targetAnchors);
        }
    }
    function _addSourceEndPoint(toId, sourceAnchors) {
        var sourceUUID = toId + sourceAnchors + 'source';
        sourceEndpoint.uuid = sourceUUID;
        sourceEndpoint.anchor = sourceAnchors;
        return jsPlumbInstance.addEndpoint(toId, sourceEndpoint);
    }
    function _addTargetEndPoint(toId, targetAnchors) {
        var targetUUID = toId + targetAnchors + 'target';
        targetEndpoint.uuid = targetUUID;
        targetEndpoint.anchor = targetAnchors;
        return jsPlumbInstance.addEndpoint(toId, targetEndpoint);
    }

    _saveFlowchart = function () {
        savedData = [];
        var totalCount = 0;
        if (elementCount > 0) {
            var nodes = [];

            //check whether the diagram has a start element
            var elm = $(".start.jtk-node");
            if (elm.length == 0) {
                alertify.error("The flowchart diagram should have a start element");
            } else {
                $(".jtk-node").each(function (index, element) {
                    totalCount++;
                    var $element = $(element);
                    var type = $element.attr('class').toString().split(" ")[1];
                    if (type == "step" || type == "diamond" || type == "parallelogram") {
                        nodes.push({
                            id: $element.attr('id'),
                            nodeType: type,
                            left: parseInt($element.css("left"), 10),
                            top: parseInt($element.css("top"), 10),
                            clsName: $element.attr('class').toString(),
                            label: $element.text(),
                            width: $element.outerWidth(),
                            height: $element.outerHeight()
                        });
                    } else {
                        nodes.push({
                            id: $element.attr('id'),
                            nodeType: $element.attr('class').toString().split(" ")[1],
                            left: parseInt($element.css("left"), 10),
                            top: parseInt($element.css("top"), 10),
                            clsName: $element.attr('class').toString(),
                            label: $element.text()
                        });
                    }
                });

                var connections = [];
                $.each(jsPlumbInstance.getConnections(), function (index, connection) {
                    connections.push({
                        sourceId: connection.sourceId,
                        targetId: connection.targetId
                    });
                });

                var flowchart = {};
                flowchart.nodes = nodes;
                flowchart.connections = connections;
                flowchart.numberOfElements = totalCount;
                savedData = flowchart;
                console.log(JSON.stringify(flowchart));
            }
        }
    }

    _loadFlowchart = function () {
        var nodes = savedData.nodes;
        var element;
        nodes.forEach(function (node) {

            elementCount++;
            loadProperties(node.clsName, "5em", "5em", node.nodeType, startEndPoints[node.nodeType].startpoints, startEndPoints[node.nodeType].endpoints, false);

            properties[0].top = node.top;
            properties[0].left = node.left;

            element = createElement(node.id);

            drawElement(element, "#canvas", node.id);
            $("#canvas").append(element);
            jsPlumbInstance.draggable(jsPlumbInstance.getSelector(".jtk-node"), {
                grid: [20, 20]
            });
        });

        var connections = savedData.connections;
        $.each(connections, function (index, elem) {
            var endPoint1 = jsPlumbInstance.addEndpoint(elem.sourceId, sourceEndpoint);
            var endPoint2 = jsPlumbInstance.addEndpoint(elem.targetId, targetEndpoint);
            var connection1 = jsPlumbInstance.connect({
                source: endPoint1,
                target: endPoint2,
                anchors: elem.anchors,
                paintStyle: connectorPaintStyle,
                hoverPaintStyle: connectorHoverStyle,
                endpointHoverStyle: endpointHoverStyle
            });
        });
    }
});