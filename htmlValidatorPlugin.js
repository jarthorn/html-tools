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
/*global define require eclipse Tautologistics window */

window.onload = function() {
	function validate(contents) {
		var errors = [];
		var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function(error, dom) {
			if (error) {
				errors.push(error);
			} else {
				//parsing done
			}
		});
		var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
		parser.parseComplete(window.document.body.innerHTML);
		return errors;
	}

	function cleanup(error) {}

	var validationService = {
		checkSyntax: function(title, contents) {
			var result = validate(contents);
			//this.dispatchEvent("syntaxChecked", {title: title, result: result});
			var problems = [];
			var i;
			if (result.errors) {
				var errors = result.errors;
				for (i = 0; i < errors.length; i++) {
					var error = errors[i];
					if (error) {
						// Convert to format expected by validation service
//						error.description = error.reason;
//						error.start = error.character;
//						error.end = end;
//						error = cleanup(error);
//						if (error) {
//							problems.push(error);
//						}
					}
				}
			}
			return {
				problems: problems
			};
		}
	};

	//finally create the plugin
	var provider = new eclipse.PluginProvider();
	provider.registerServiceProvider("orion.edit.validator", validationService, {
		pattern: "\\.(htm|html)$"
	});
	provider.connect();

};