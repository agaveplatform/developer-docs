function handleLogin(){var t=[],e=window.swaggerUi.api.authSchemes||window.swaggerUi.api.securityDefinitions;if(e){var i,n=e;for(i in n){var s=n[i];if("oauth2"===s.type&&s.scopes){oauth2KeyName=i;var r;if(Array.isArray(s.scopes)){var o;for(o=0;o<s.scopes.length;o++)t.push(s.scopes[o])}else for(r in s.scopes)t.push({scope:r,description:s.scopes[r]})}}}for(window.swaggerUi.api&&window.swaggerUi.api.info&&(appName=window.swaggerUi.api.info.title),popupDialog=$(['<div class="modal api-popup-dialog in" id="credentials-modal" tabindex="-1" role="dialog" aria-labelledby="credentials-modal-label" aria-hidden="false" style="display: block;">','<div class="modal-dialog">','<div class="modal-content">','<div class="modal-header">','<button type="button" class="close api-popup-cancel" data-dismiss="modal"><span aria-hidden="true">\xd7</span><span class="sr-only">Close</span></button>','<h3 class="modal-title" id="credentials-modal-label">Select OAuth2.0 Scopes</h3>',"</div>",'<div class="modal-body">',"<p>Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.",'<a href="#">Learn how to use</a>',"</p>","<p><strong>"+appName+"</strong> API requires the following scopes. Select which ones you want to grant to Swagger UI.</p>","<form>",'<div class="api-popup-scopes">','<div class="scopes">',"</div>","</div>","<form>",'<p class="error-msg"></p>',"</div>",'<div class="modal-footer">','<div class="api-popup-actions"><button class="api-popup-cancel btn btn-default" type="button">Cancel</button><button class="api-popup-authbtn btn btn-primary" type="button">Authorize</button></div>',"</div>","</div>","</div>","</div>"].join("")),$(document.body).append(popupDialog),popup=popupDialog.find(".scopes").empty(),o=0;o<t.length;o++)r=t[o],str='<span data-toggle-scope="'+r.scope+'" class="scope">'+r.scope+"</span>",popup.append(str);popupDialog.find("scopes").click(function(){popupMask.hide(),popupDialog.hide(),popupDialog.empty(),popupDialog=[]}),popupDialog.find("[data-toggle-scope]").click(function(){$(this).hasClass("active")?$(this).removeClass("active"):$(this).addClass("active")}),popupDialog.find("button.api-popup-cancel").click(function(){popupMask.hide(),popupDialog.hide(),popupDialog.empty(),popupDialog=[]}),$("button.api-popup-authbtn").unbind(),popupDialog.find("button.api-popup-authbtn").click(function(){popupMask.hide(),popupDialog.hide();var t=window.swaggerUi.api.authSchemes,e=window.location,i=location.pathname.substring(0,location.pathname.lastIndexOf("/")),n=e.protocol+"//"+e.host+i+"/o2c.html",s=window.oAuthRedirectUrl||n,r=null;for(var o in t)if(t.hasOwnProperty(o)){var a=t[o].flow;if("oauth2"!==t[o].type||!a||"implicit"!==a&&"accessCode"!==a){if(t[o].grantTypes){var h=t[o].grantTypes;for(var l in h)if(h.hasOwnProperty(l)&&"implicit"===l){var c=h[l];c.loginEndpoint.url;r=c.loginEndpoint.url+"?response_type=token",window.swaggerUi.tokenName=c.tokenName}else if(h.hasOwnProperty(l)&&"accessCode"===l){var c=h[l];c.tokenRequestEndpoint.url;r=c.tokenRequestEndpoint.url+"?response_type=code",window.swaggerUi.tokenName=c.tokenName}}}else{var c=t[o];r=c.authorizationUrl+"?response_type="+("implicit"===a?"token":"code"),window.swaggerUi.tokenName=c.tokenName||"access_token",window.swaggerUi.tokenUrl="accessCode"===a?c.tokenUrl:null}}var p=[],h=$(".scopes").find(".active");for(k=0;k<h.length;k++){var u=$(h[k]).attr("data-toggle-scope");-1===p.indexOf(u)&&p.push(u)}var d=Math.random();window.enabledScopes=p,redirect_uri=s,r+="&redirect_uri="+encodeURIComponent(s),r+="&realm="+encodeURIComponent(realm),r+="&client_id="+encodeURIComponent(clientId),r+="&scope="+encodeURIComponent(p.join(" ")),r+="&state="+encodeURIComponent(d),window.open(r)}),popupMask.show(),popupDialog.show()}function handleLogout(){for(key in window.authorizations.authz)window.authorizations.remove(key);window.enabledScopes=null;var t=$(".api-ic");t.addClass("btn-default"),t.removeClass("btn-success"),t.removeClass("btn-warning"),t.text("oauth"),$("#input_apiKey").val("")}function initOAuth(t){var e=t||{},i=[];if(appName=e.appName||i.push("missing appName"),popupMask=e.popupMask||$("#api-common-mask"),popupDialog=e.popupDialog||$(".api-popup-dialog"),clientId=e.clientId||i.push("missing client id"),realm=e.realm||i.push("missing realm"),i.length>0)return void log("auth unable initialize oauth: "+i);$("pre code").each(function(t,e){hljs.highlightBlock(e)});var n=$(".api-ic");n.unbind(),n.click(function(t){$(t.target).hasClass("btn-default")?handleLogin():handleLogout()})}var appName,popupMask,popupDialog,clientId,realm,oauth2KeyName,redirect_uri;window.processOAuthCode=function(t){var e={client_id:clientId,code:t.code,grant_type:"authorization_code",redirect_uri:redirect_uri};$.ajax({url:window.swaggerUi.tokenUrl,type:"POST",data:e,success:function(t,e,i){onOAuthComplete(t)},error:function(t,e,i){onOAuthComplete("")}})},window.onOAuthComplete=function(t){if(t)if(t.error){var e=$("input[type=checkbox],.secured");e.each(function(t){e[t].checked=!1}),alert(t.error)}else{var i=t[window.swaggerUi.tokenName];if(i){var n=null;$.each($(".auth #api_information_panel"),function(t,e){var i=e;if(i&&i.childNodes){var s=[];$.each(i.childNodes,function(t,e){var i=e.innerHTML;i&&s.push(i)});for(var r=[],o=0;o<s.length;o++){var a=s[o];window.enabledScopes&&-1==window.enabledScopes.indexOf(a)&&r.push(a)}r.length>0?(n=e.parentNode,$(n).find(".api-ic").addClass("btn-warning"),$(n).find(".api-ic").removeClass("btn-default"),$(n).find(".api-ic").removeClass("btn-success")):(n=e.parentNode,$(n).find(".api-ic").addClass("btn-success"),$(n).find(".api-ic").removeClass("btn-default"),$(n).find(".api-ic").removeClass("btn-warning"))}}),$(".api-ic").text("signout"),$("#input_apiKey").val(i),window.swaggerUi.api.clientAuthorizations.add(oauth2KeyName,new SwaggerClient.ApiKeyAuthorization("Authorization","Bearer "+i,"header"))}}};