"use strict";angular.module("volunteerApp",["ui.router","ngCookies"]).config(function(e,i){e.state("app",{url:"/",views:{header:{templateUrl:"views/header.html"},content:{templateUrl:"views/home.html",controller:"IndexController"},footer:{templateUrl:"views/footer.html"}}}).state("app.register",{url:"register",views:{"content@":{templateUrl:"views/register.html",controller:"RegisterController"}}}).state("app.activities",{url:"activities",views:{"content@":{templateUrl:"views/activities.html",controller:"ActivitiesController"}}}),i.otherwise("/")}),angular.module("volunteerApp").controller("IndexController",["$scope","organizationFactory",function(e,i){i.getOrganizations().then(function(i){e.organizations=i.data;for(var a=[],t=0;t<e.organizations.length;t++)if(e.organizations[t].activities)for(var n=0;n<e.organizations[t].activities.length;n++)a.push([e.organizations[t].activities[n].category,e.organizations[t].activities[n].periodicity,function(e){var i="",a=0==(i+=e.monday?"S":"").length?"":" ";return a=0==(i+=e.tuesday?a+"T":"").length?"":" ",a=0==(i+=e.wednesday?a+"Q":"").length?"":" ",a=0==(i+=e.thursday?a+"Q":"").length?"":" ",a=0==(i+=e.friday?a+"S":"").length?"":" ",a=0==(i+=e.saturday?a+"S":"").length?"":" ",i+=e.sunday?a+"D":""}(e.organizations[t].activities[n]),function(e){return e.beginningTime+" - "+e.endingTime}(e.organizations[t].activities[n]),e.organizations[t].acronym,e.organizations[t].address]);console.log("Organizações/Atividades lidas com sucesso"),$.fn.dataTable.isDataTable("#table")?table=$("#table").DataTable():table=$("#table").DataTable({order:[[0,"asc"]],language:{sEmptyTable:"Nenhum registro encontrado",sInfo:"Mostrando de _START_ até _END_ de _TOTAL_ registros",sInfoEmpty:"Mostrando 0 até 0 de 0 registros",sInfoFiltered:"(Filtrados de _MAX_ registros)",sInfoPostFix:"",sInfoThousands:".",sLengthMenu:"_MENU_ resultados por página",sLoadingRecords:"Carregando...",sProcessing:"Processando...",sZeroRecords:"Nenhum registro encontrado",sSearch:"Pesquisar",oPaginate:{sNext:"Próximo",sPrevious:"Anterior",sFirst:"Primeiro",sLast:"Último"},oAria:{sSortAscending:": Ordenar colunas de forma ascendente",sSortDescending:": Ordenar colunas de forma descendente"}},data:a,columns:[{title:"Categoria"},{title:"Periodicidade"},{title:"Dias da semana"},{title:"Horário"},{title:"Organização"},{title:"Endereço"}]})},function(e){console.log("Erro na leitura das Organizações/Atividades: "+e.status+" "+e.statusText)})}]),angular.module("volunteerApp").controller("LoginController",["$scope","$location","organizationFactory","userPersistenceFactory",function(e,i,a,t){function n(){if(null!=t.getUser()){var i=t.getUser();a.getOrganization(i).then(function(i){e.loggedUserAcronym=i.data.acronym,console.log("Acrônimo lido com sucesso")},function(e){console.log("Erro na leitura do acrônimo: "+e.status+" "+e.statusText)})}}var o=[];a.getOrganizations().then(function(e){o=e.data},function(e){console.log("Erro: "+e.status+" "+e.statusText)}),jQuery("#loginErrorMessage").hide(),e.login=function(){for(var e,a=jQuery("#loginEmail").val(),r=jQuery("#loginPassword").val(),s=!1,l=0;l<o.length;l++){var u=o[l];if(u.email==a&&u.password==r){s=!0,e=u;break}}s?(t.setUser(e.id),n(),jQuery("#loginErrorMessage").hide(),jQuery("#loginModal").modal("hide"),i.path("/")):jQuery("#loginErrorMessage").show(),jQuery("#loginEmail").val(""),jQuery("#loginPassword").val("")},e.logout=function(){t.removeUser(),i.path("/")},e.forgetPassword=function(){console.log("Cliquei no Esqueci minha senha")},e.hasLoggedUser=function(){return!(null==t.getUser())},n()}]),angular.module("volunteerApp").controller("RegisterController",["$scope","$location","organizationFactory","userPersistenceFactory",function(e,i,a,t){e.religions=[{value:"Sem religião",label:"Sem religião"},{value:"Católica",label:"Católica"},{value:"Evangélica",label:"Evangélica"},{value:"Espírita",label:"Espírita"},{value:"Ateu",label:"Ateu"}];var n="";if(jQuery("#fileInput").on("change",function(e){var i=e.target.files[0];if(i){jQuery("#fileChooserText").text(i.name);var a=new FileReader;a.onloadend=function(e){n=e.target.result,jQuery("#imageDiv > img").remove(),jQuery("#imageDiv").append('<img id="theImg" width="200" src="'+n+'"/>')},a.readAsDataURL(i)}}),jQuery("#phone").mask("(99) 9999?9-9999"),jQuery("#phone").on("blur",function(){var e=$(this).val().substr($(this).val().indexOf("-")+1);if(3==e.length){var i=$(this).val().substr($(this).val().indexOf("-")-1,1)+e,a=$(this).val().substr(0,9);$(this).val(a+"-"+i)}}),e.organization={id:"",email:"",password:"",passwordConfirmation:"",name:"",acronym:"",image:"",religion:"Sem religião",description:"",address:"",phone:"",activities:[]},e.registerOrganization=function(){null==t.getUser()?(e.organization.image=n,a.postOrganization(e.organization).then(function(e){console.log("Cadastro da organização realizado com sucesso"),i.path("/")},function(e){console.log("Erro no cadastro da organização: "+e.status+" "+e.statusText),i.path("/")})):(""!=n&&(e.organization.image=n),a.updateOrganization(e.organization).then(function(e){console.log("Atualização da organização realizada com sucesso"),i.path("/")},function(e){console.log("Erro na atualização da organização: "+e.status+" "+e.statusText),i.path("/")}))},null!=t.getUser()){var o=t.getUser();a.getOrganization(o).then(function(i){e.organization=i.data,jQuery("#registerBreadcrumb").text("Editar"),jQuery("#registerTitle").text("Edite o cadastro da sua organização"),jQuery("#fileChooserText").text("Veja a imagem atual ao lado"),jQuery("#imageDiv > img").remove(),jQuery("#imageDiv").append('<img id="theImg" width="200" src="'+e.organization.image+'"/>'),jQuery("#registerSubmitButton").text("Editar"),console.log("Organização logada lida com sucesso")},function(e){console.log("Erro na leitura da organização logada: "+e.status+" "+e.statusText)})}}]),angular.module("volunteerApp").controller("ActivitiesController",["$scope","$state","organizationFactory","userPersistenceFactory",function(e,i,a,t){e.categories=[{value:"Educação",label:"Educação"},{value:"Recreação infantil",label:"Recreação infantil"},{value:"Distribuição de alimentos",label:"Distribuição de alimentos"},{value:"Artesanato",label:"Artesanato"},{value:"Esporte",label:"Esporte"}];if(e.periodicities=[{value:"Semanal",label:"Semanal"},{value:"Mensal",label:"Mensal"},{value:"Semestral",label:"Semestral"},{value:"Anual",label:"Anual"}],null!=t.getUser()){var n=t.getUser();a.getOrganization(n).then(function(i){e.organization=i.data,console.log("Organização lida com sucesso para atividades")},function(e){console.log("Erro na leitura da organização para atividades: "+e.status+" "+e.statusText)})}e.creatingActivity={name:"",category:"Educação",description:"",periodicity:"Semanal",monday:!0,tuesday:!0,wednesday:!0,thursday:!0,friday:!0,saturday:!0,sunday:!0,beginningTime:"12:00",endingTime:"13:00"},jQuery("#beginningTime").timepicker({timeFormat:"HH:mm",interval:30,minTime:"00",maxTime:"23:30",defaultTime:"12",startTime:"00:00",dynamic:!0,dropdown:!0,scrollbar:!0}),jQuery("#endingTime").timepicker({timeFormat:"HH:mm",interval:30,minTime:"00",maxTime:"23:30",defaultTime:"13",startTime:"00:00",dynamic:!0,dropdown:!0,scrollbar:!0}),e.pushActivity=function(){e.creatingActivity.beginningTime=jQuery("#beginningTime").val(),e.creatingActivity.endingTime=jQuery("#endingTime").val(),e.organization.activities.push(e.creatingActivity),a.updateOrganization(e.organization).then(function(a){console.log("Atualização das atividades realizada com sucesso"),e.creatingActivity={name:"",category:"Educação",description:"",periodicity:"Semanal",monday:!0,tuesday:!0,wednesday:!0,thursday:!0,friday:!0,saturday:!0,sunday:!0,beginningTime:"12:00",endingTime:"13:00"},e.activityForm.$setPristine(),setTimeout(function(){i.reload()},250)},function(e){console.log("Erro na atualização das atividades: "+e.status+" "+e.statusText)})},e.removeActivity=function(i){e.organization.activities.splice(i,1),a.updateOrganization(e.organization).then(function(e){console.log("Remoção de atividade realizada com sucesso")},function(e){console.log("Erro na remoção de atividade: "+e.status+" "+e.statusText)})},e.setUpdatingActivityIndex=function(e){console.log("Setou index = "+e),jQuery("#activityIndex").val(e)},e.getActivityIndex=function(){return console.log("Leu index = "+jQuery("#activityIndex").val()),jQuery("#activityIndex").val()},jQuery("#activityModal").on("shown.bs.modal",function(i){jQuery("#updatingActivityBeginningTime").timepicker({timeFormat:"HH:mm",interval:30,minTime:"00",maxTime:"23:30",defaultTime:"12",startTime:"00:00",dynamic:!0,dropdown:!0,scrollbar:!0,zindex:9999}),jQuery("#updatingActivityBeginningTime").val(e.organization.activities[jQuery("#activityIndex").val()].beginningTime),jQuery("#updatingActivityEndingTime").timepicker({timeFormat:"HH:mm",interval:30,minTime:"00",maxTime:"23:30",defaultTime:"13",startTime:"00:00",dynamic:!0,dropdown:!0,scrollbar:!0,zindex:9999}),jQuery("#updatingActivityEndingTime").val(e.organization.activities[jQuery("#activityIndex").val()].endingTime)}),e.updateActivity=function(){e.organization.activities[jQuery("#activityIndex").val()].beginningTime=jQuery("#updatingActivityBeginningTime").val(),e.organization.activities[jQuery("#activityIndex").val()].endingTime=jQuery("#updatingActivityEndingTime").val(),a.updateOrganization(e.organization).then(function(e){console.log("Atualização da atividade realizada com sucesso"),jQuery("#activityModal").modal("hide"),setTimeout(function(){i.reload()},250)},function(e){console.log("Erro na atualização da atividade: "+e.status+" "+e.statusText),jQuery("#activityModal").modal("hide")}),e.updatingActivityForm.$setPristine()},e.daysToString=function(e){var i="",a=0==(i+=e.monday?"Segundas":"").length?"":", ";a=0==(i+=e.tuesday?a+"Terças":"").length?"":", ",a=0==(i+=e.wednesday?a+"Quartas":"").length?"":", ",a=0==(i+=e.thursday?a+"Quintas":"").length?"":", ",a=0==(i+=e.friday?a+"Sextas":"").length?"":", ",a=0==(i+=e.saturday?a+"Sábados":"").length?"":", ";return i+=e.sunday?a+"Domingos":""}}]),angular.module("volunteerApp").constant("baseURL","http://localhost:3000/").service("organizationFactory",["$http","baseURL",function(e,i){this.getOrganizations=function(){return e.get(i+"organizations")},this.getOrganization=function(a){return e.get(i+"organizations/"+a)},this.postOrganization=function(a){return e.post(i+"organizations",a)},this.updateOrganization=function(a){return e.put(i+"organizations/"+a.id,a)},this.deleteOrganization=function(a){return e.delete(i+"organizations/"+a)}}]).service("userPersistenceFactory",["$cookies",function(e){this.setUser=function(i){e.put("user",i)},this.getUser=function(){return e.get("user")},this.removeUser=function(){e.remove("user")}}]);