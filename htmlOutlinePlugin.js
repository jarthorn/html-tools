/*******************************************************************************
 * @license
 * Copyright (c) 2010, 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*jslint forin:true regexp:false*/
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
		var options = {includeLocation: true};
		var parser = new Tautologistics.NodeHtmlParser.Parser(handler, options);
		parser.parseComplete(contents);
		return domResult;
	}

	function domToOutline(dom) {
		//end recursion
		if (!dom) {
			return null;
		}
		var outline = [];
		for (var i = 0; i < dom.length; i++) {
			var node = dom[i];
			if (node.name) {
				var element = {
					label: node.raw,
					children: domToOutline(node.children),
					line: node.location.line
				};
				outline.push(element);
			}
		}
		return outline;
	}

	var outlineService = {
		getOutline: function(contents, title) {
			var dom = parse(contents);
			if (dom) {
				return domToOutline(dom);
			}
		}
	};

	//finally create the plugin
	var provider = new eclipse.PluginProvider();
	provider.registerServiceProvider("orion.edit.outliner", outlineService, {
		pattern: "\\.html?$",
		name: "HTML Outline",
		id: "orion.edit.outliner.html"
	});
	provider.connect();

};