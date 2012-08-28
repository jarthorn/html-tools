/*******************************************************************************
 * @license
 * Copyright (c) 2011, 2012 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*global Tautologistics eclipse window */

window.onload = function() {
	function parse(contents) {
		var domResult;
		var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function(error, dom) {
			if (!error) {
				//parsing done
				domResult = dom;
			}
		});
		var options = {
			includeLocation: true
		};
		var parser = new Tautologistics.NodeHtmlParser.Parser(handler, options);
		parser.parseComplete(contents);
		return domResult;
	}

	/**
	 * Returns whether this HTML node should be omitted from the outline.
	 * @param {Object} node The HTML element
	 * @param {Boolean} filter if true the tree should be filtered to only show most relevant entries
	 * @return {boolean} true if the element should be skipped, and false otherwise
	 */

	function skip(node, filter) {
		//skip nodes with no name
		if (!node.name) {
			return true;
		}

		//if user wants a full tree, do no further filtering
		if (!filter) {
			return false;
		}
		//skip formatting elements
		if (node.name === "b" || node.name === "i" || node.name === "em") {
			return true;
		}

		//skip paragraphs and other blocks of formatted text
		if (node.name === "p" || node.name === "tt" || node.name === "code" || node.name === "blockquote") {
			return true;
		}

		//skip anchors
		if (node.name === "a") {
			return true;
		}

		//include the element if we have no reason to skip it
		return false;
	}

	/**
	 * Converts an HTML dom element into a label
	 * @param {Object} element The HTML element
	 * @return {String} A human readable label
	 */

	function domToLabel(node) {
		var label = node.name;
		//include id if present
		var match = /id=['"]\S*["']/.exec(node.raw);
		if (match) {
			label = label + " " + match[0];
		}
		//include class if present
		match = /class=['"]\S*["']/.exec(node.raw);
		if (match) {
			label = label + " " + match[0];
		}
		return label;
	}

	/**
	 * Converts an HTML DOM node into an outline element
	 * @param {Object} An HTML DOM node as returned by the Tautologistics HTML parser
	 * @param {Boolean} filter if true the tree should be filtered to only show most relevant entries
	 * @return {Object} A node in the outline tree
	 */

	function domToOutline(dom, filter) {
		//end recursion
		if (!dom) {
			return null;
		}
		var outline = [];
		for (var i = 0; i < dom.length; i++) {
			var node = dom[i];
			if (!skip(node, filter)) {
				var element = {
					label: domToLabel(node),
					children: domToOutline(node.children, filter),
					line: node.location.line
				};
				outline.push(element);
			}
		}
		return outline;
	}

	/**
	 * Returns the DOM node corresponding to the HTML body, 
	 * or null if no such node could be found.
	 */

	function findBody(dom) {
		//recursively walk the dom looking for a body element
		for (var i = 0; i < dom.length; i++) {
			if (dom[i].name === "body") {
				return dom[i].children;
			}
			if (dom[i].children) {
				var result = findBody(dom[i].children);
				if (result) {
					return result;
				}
			}
		}
		return null;
	}

	function buildOutline(contents, title, filter) {
		var dom = parse(contents);
		if (!dom) {
			return null;
		}
		if (filter) {
			//only process the document body
			var body = findBody(dom);
			if (body) {
				dom = body;
			}
		}
		var outline = domToOutline(dom, filter);
		return outline;
	}

	var outlineService = {
		getOutline: function(contents, title) {
			return buildOutline(contents, title, false);
		}
	};

	var filteredOutlineService = {
		getOutline: function(contents, title) {
			return buildOutline(contents, title, true);
		}
	};

	//finally create the plugin
	var provider = new eclipse.PluginProvider();
	provider.registerServiceProvider("orion.edit.outliner", outlineService, {
		pattern: "\\.html?$",
		name: "Full HTML",
		id: "orion.edit.outliner.html"
	});
	provider.registerServiceProvider("orion.edit.outliner", filteredOutlineService, {
		pattern: "\\.html?$",
		name: "Filtered HTML",
		id: "orion.edit.outliner.html.filtered"
	});
	provider.connect();

};