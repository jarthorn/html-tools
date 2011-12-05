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
		var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
		parser.parseComplete(contents);
		return domResult;
	}

	function domToOutline(dom) {
		var outline = [];
		var element = {
			label: "test",
			children: null,
			start: 0,
			end: 5
		};
		outline.push(element);
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